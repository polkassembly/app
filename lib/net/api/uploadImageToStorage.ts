const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMAGEBB_API_KEY;

export async function uploadImageToStorage(imageUri: string): Promise<string> {
  try {
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
      console.log("Uploaded image to storage:", uploadData.data.url);
      return uploadData.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    console.error("uploadImageToStorage error:", error);
    throw error;
  }
}
