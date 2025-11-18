"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { useRouter } from "next/navigation";
import PostEditorHeader from "../post-editor-header";
import PostEditorContent from "../post-editor-content";
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10, "maximum 10 tags allowed"),
  featuredImage: z.string().optional(),
  scheduledFor: z.string().optional(),
});

const PostEditor = ({ initalData = null, mode = "create" }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalType, setImageModalType] = useState("featured");
  const [quillRef, setQuillRef] = useState(null);
  const router = useRouter();
  const { mutate: createPost, isLoading: isCreateLoading } = useConvexMutation(
    api.posts.create
  );
  const { mutate: updatePost, isLoading: isUpdating } = useConvexMutation(
    api.posts.update
  );
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initalData?.title || "",
      content: initalData?.content || "",
      category: initalData?.category || "",
      tags: initalData?.tags || [],
      featuredImage: initalData?.featuredImage || "",
      scheduledFor: initalData?.scheduledFor
        ? new Date(initalData.scheduledFor).toISOString().slice(0, 16)
        : "",
    },
  });

  const handleSave = () => {};
  const handlePublish = () => {};
  const handleSchedule = () => {};
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PostEditorHeader
        mode={mode}
        initialData={initalData}
        isPublishing={isCreateLoading || isUpdating}
        onSave={handleSave}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
        onSettingOpen={() => setIsSettingsOpen(true)}
        onBack={() => router.push("/dashboard")}
      />
      <PostEditorContent
        form={form}
        setQuillRef={setQuillRef}
        onImageUpload={(type) => {
          setImageModalType(type);
          setIsImageModalOpen(true);
        }}
      />
    </div>
  );
};

export default PostEditor;
