"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { RouterOutputs } from "@no-stack/api";

import { UserAvatar } from "@/components/composite/user/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { api } from "@/trpc/react";
import { uploadAvatar } from "@/utils/supabase/storage";

type UserProfile = RouterOutputs["user"]["getUserProfile"];

interface AccountFormProps {
  initialProfile: UserProfile;
}

export function AccountForm({ initialProfile }: AccountFormProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [imageUrl, setImageUrl] = useState(initialProfile?.image ?? "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: updateProfile, isPending: isUpdating } =
    api.user.updateUserProfile.useMutation({
      onSuccess: async () => {
        await utils.user.invalidate();
        toast.success("Profile updated.");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: deleteProfile, isPending: isDeleting } =
    api.user.deleteUserProfile.useMutation({
      onSuccess: () => {
        setShowDeleteDialog(false);
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      ...(imageUrl ? { image: imageUrl } : {}),
    });
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation.toLowerCase() === "delete account") {
      deleteProfile();
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setIsUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];

      if (!file) {
        throw new Error("No file selected");
      }

      if (!initialProfile?.id) {
        throw new Error("User ID not found");
      }

      const publicUrl = await uploadAvatar(initialProfile.id, file);

      setImageUrl(publicUrl);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" style={{ textWrap: "balance" }}>
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="profile-form" onSubmit={handleSave} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-24">
                <UserAvatar imageUrl={imageUrl} />
              </div>
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer text-sm text-primary hover:text-primary/80"
              >
                {isUploading ? "Uploading\u2026" : "Upload new picture"}
              </Label>
              <Input
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                value={initialProfile?.email ?? ""}
                readOnly
                spellCheck={false}
                className="cursor-not-allowed text-muted-foreground"
                placeholder="you@example.com"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="profile-form"
            className="w-full"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving\u2026" : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {/* Danger zone card */}
      <Card>
        <CardHeader>
          <CardTitle
            className="text-lg text-destructive"
            style={{ textWrap: "balance" }}
          >
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting\u2026" : "Delete Account"}
          </Button>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type
              {" \u201CDelete account\u201D "}
              to confirm.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">Confirmation</Label>
              <Input
                id="delete-confirmation"
                name="confirmation"
                autoComplete="off"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Delete account"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={
                  deleteConfirmation.toLowerCase() !== "delete account" ||
                  isDeleting
                }
              >
                {isDeleting ? "Deleting\u2026" : "Delete Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
