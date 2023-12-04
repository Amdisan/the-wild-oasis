import { supabase } from './supabase';
import { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data: cabins, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.log(error);
    throw new Error('Cabins could not be loaded');
  }

  return cabins;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin_images/${imageName}`;

  //1 create/edit cabin
  let query = supabase.from('cabins');

  //A create
  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  //B edit
  if (id) {
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq('id', id)
      .select();
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Cabin could not be created');
  }

  //2 upload image
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from('cabin_images')
      .upload(imageName, newCabin.image);

    //3 delete the cabin if there was an error uploading image
    if (storageError) {
      await supabase.from('cabins').delete().eq('id', data.id);
      console.log(storageError);
      throw new Error(
        'Cabin image could not be uploaded and the cabin was not created'
      );
    }
  }
  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Cabin could not be deleted');
  }
  return data;
}
