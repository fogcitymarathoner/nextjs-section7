"use server"

import {storePost, updatePostLikeStatus} from '@/lib/posts';
import {redirect} from "next/navigation";
import {uploadImage} from "@/lib/cloudinary";
import {revalidatePath} from "next/cache";

export async function createPost(prevState, formData) {
    const title = formData.get('title');
    const image = formData.get('image');
    const content = formData.get('content');
    console.log(title, content)
    console.log(image)
    let errors = []
    if (!title || title.trim().length === 0) {
        errors.push('Title is required');
    }
    if (!content || content.trim().length === 0) {
        errors.push('Content is required');
    }
    if (!image) {
        errors.push('Image is required');
    }
    if (errors.length > 0) {
        return {errors};
    }
    let imageUrl
    try {
        imageUrl = await uploadImage(image);
    } catch (error) {
        throw new Error('Image upload failed, post was not created. Please try again later.')
    }
    storePost({
        imageUrl: imageUrl,
        title,
        content,
        image: '',
        userId: 1
    })
    revalidatePath('/posts')
    redirect('feed')
}

export async function togglePostLikeStatus(postId) {
    await updatePostLikeStatus(postId, 2)
    revalidatePath('/posts')
}