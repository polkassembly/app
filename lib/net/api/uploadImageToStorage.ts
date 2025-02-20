const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMAGEBB_API_KEY;
const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export async function uploadImageToStorage(imageUri: string): Promise<string> {
  try {

    //validations
    const fileInfo = await fetch(imageUri).then(r => ({
      size: parseInt(r.headers.get('content-length') || '0'),
      type: r.headers.get('content-type')
    }));

    if (fileInfo.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    if (!ALLOWED_FILE_TYPES.includes(fileInfo.type || '')) {
      throw new Error('Invalid file type. Only JPG and PNG are allowed');
    }

    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const filename = imageUri.split('/').pop() || `upload_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image";

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const res = await fetch(imgbbUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const uploadData = await res.json();
    if (uploadData?.success) {
      return uploadData.data.url;
    } else {
      throw new Error(uploadData.error?.message || "Image upload failed");
    }
  } catch (error) {
    console.error("Image upload failed:", error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
