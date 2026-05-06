<script lang="ts">
  import { uploadImage, toBase64, generateFilePath } from '@lib/api/uploads';
  import { getImageUrl } from '@lib/utils/image';
  
  let { 
    bucket = 'products', 
    folder = 'images', 
    label = 'Upload Image', 
    initialImage = '',
    onUpload 
  } = $props<{
    bucket?: string;
    folder?: string;
    label?: string;
    initialImage?: string;
    onUpload: (url: string) => void;
  }>();

  let uploading = $state(false);
  let errorMsg = $state('');
  
  // Local preview URL (blob) if a file is chosen, otherwise null
  let previewUrl = $state<string | null>(null);
  
  // Derived display URL: uses local preview if available, otherwise formed from props
  let displayUrl = $derived(previewUrl || getImageUrl(initialImage, bucket));
  
  let fileInput: HTMLInputElement;

  // Cleanup object URLs to prevent memory leaks
  $effect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  });

  async function handleUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      uploading = true;
      errorMsg = '';
      
      // Set local preview
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      previewUrl = URL.createObjectURL(file); 

      const filePath = generateFilePath(folder, file.name);
      const base64 = await toBase64(file);
      
      const result = await uploadImage({
        bucket,
        path: filePath,
        base64,
        contentType: file.type || 'application/octet-stream'
      });

      if (!result.success || !result.publicUrl) {
        throw new Error(result.error || 'Upload failed');
      }

      // We propagate the publicUrl as per current data model, 
      // but the component shows it via currentImageUrl (blob or proxied)
      onUpload(result.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      errorMsg = 'Upload failed. Please check your connection.';
    } finally {
      uploading = false;
    }
  }
</script>

<div class="upload-editorial">
  <span class="input-label">{label}</span>
  
  <div class="preview-container" class:has-image={!!displayUrl}>
    {#if displayUrl}
      <img src={displayUrl} alt="Preview" />
    {:else}
      <div class="upload-placeholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <p>Upload Image</p>
      </div>
    {/if}
    
    <button 
      type="button" 
      onclick={() => fileInput.click()}
      disabled={uploading}
      class="trigger-btn"
    >
      {uploading ? 'Uploading...' : 'Choose File'}
    </button>
  </div>

  {#if errorMsg}
    <div class="error-text">{errorMsg}</div>
  {/if}

  <input
    type="file"
    accept="image/*"
    bind:this={fileInput}
    onchange={handleUpload}
    hidden
  />
</div>

