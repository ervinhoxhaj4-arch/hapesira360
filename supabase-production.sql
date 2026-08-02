-- Run once in Supabase SQL Editor after the original schema.

create policy "Authenticated users can insert properties"
on properties for insert to authenticated with check (true);

create policy "Authenticated users can update properties"
on properties for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete properties"
on properties for delete to authenticated using (true);

create policy "Authenticated users can insert property images"
on property_images for insert to authenticated with check (true);

create policy "Authenticated users can update property images"
on property_images for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete property images"
on property_images for delete to authenticated using (true);

-- Storage policies for the public bucket named property-images.
create policy "Public can view property image files"
on storage.objects for select to public
using (bucket_id = 'property-images');

create policy "Authenticated users can upload property image files"
on storage.objects for insert to authenticated
with check (bucket_id = 'property-images');

create policy "Authenticated users can update property image files"
on storage.objects for update to authenticated
using (bucket_id = 'property-images')
with check (bucket_id = 'property-images');

create policy "Authenticated users can delete property image files"
on storage.objects for delete to authenticated
using (bucket_id = 'property-images');
