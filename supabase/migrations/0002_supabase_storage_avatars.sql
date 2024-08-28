-- Create a bucket
insert into storage.buckets
  (id, name, public)
values
  ('avatars', 'avatars', true);

create policy "Allow users to upload their avatars to a folder named after their user id"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Allow public read access to avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');