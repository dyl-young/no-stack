import { Suspense } from "react";

import { api } from "~/trpc/server";
import { Separator } from "@/components/ui/separator";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "../../../components/composite/posts/posts";

export const runtime = "nodejs";

export default function PostsPage() {
  // You can await this here if you don't want to show Suspense fallback below
  const posts = api.post.all();

  return (
    <main className="">
      <div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Posts</h1>
        <div className="text-muted-foreground">
          <p>Perform CRUD operations to the posts table in the database</p>
          <Separator className="my-4" />
          <p>
            This is a working example of how the tRPC API can be used in a
            NextJS application.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <CreatePostForm />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          >
            <PostList posts={posts} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
