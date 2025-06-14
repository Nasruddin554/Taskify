
-- Create the avatars storage bucket and make it public
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Grant full access to authenticated users (optionally adjust as needed)
-- (No RLS enforced on storage; defaults to public access as specified above)
