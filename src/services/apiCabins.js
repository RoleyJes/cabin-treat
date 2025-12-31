import supabase from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

// My solution for creating a new cabin. Jonas's approach is to construct the image path, create the new cabin (insert the row in the cabins table) and then upload the image to the storage bucket in supabase. My approach is to upload the image to the storage, then get the public URL, then create the new cabin, referencing the url for the image column in the cabin row.

// My approach
export async function createEditCabin(newCabin, id) {
  const hasImagePath = typeof newCabin.image === "string";
  // const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = hasImagePath
    ? newCabin.image.split("/").pop()
    : `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

  // 1. Upload file/image to storage
  if (!hasImagePath) {
    const { error } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    if (error) {
      console.error(error);
      throw new Error("Cabin image could not be uploaded");
    }
  }

  // 2. Get the public URL of the uploaded image
  const {
    data: { publicUrl },
  } = supabase.storage.from("cabin-images").getPublicUrl(imageName);

  // 3. Create or edit new cabin row since there's no error uploading image to storage
  let query = supabase.from("cabins");

  // A) Create
  if (!id) query = query.insert([{ ...newCabin, image: publicUrl }]);

  // B) Edit
  if (id) query = query.update({ ...newCabin, image: publicUrl }).eq("id", id);

  const { data, error: cabinError } = await query.select();
  // const { data, error: cabinError } = await query.select().single();

  if (cabinError) {
    console.error(cabinError);
    throw new Error("Cabin could not be created");
  }

  return data;
}

// My approach for just creating cabin, not creating and editing
// export async function createCabin(newCabin) {
//   const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
//     "/",
//     "",
//   );

//   // 1. Upload file/image to storage
//   const { error } = await supabase.storage
//     .from("cabin-images")
//     .upload(imageName, newCabin.image);

//   if (error) {
//     console.error(error);
//     throw new Error("Cabin image could not be uploaded");
//   }

//   // 2. Get the public URL of the uploaded image
//   const {
//     data: { publicUrl },
//   } = supabase.storage.from("cabin-images").getPublicUrl(imageName);

//   // 3. Create new cabin row since there's no error uploading image to storage
//   const { data, error: cabinError } = await supabase
//     .from("cabins")
//     .insert([{ ...newCabin, image: publicUrl }])
//     .select();

//   if (cabinError) {
//     console.error(cabinError);
//     throw new Error("Cabin could not be created");
//   }

//   return data;
// }

// Jonas' approach
// export async function createCabin(newCabin) {
//   const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
//     "/",
//     "",
//   );

//   const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

//   // 1. Create the new cabin row
//   const { data, error } = await supabase
//     .from("cabins")
//     .insert([{ ...newCabin, image: imagePath }])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Cabin could not be created");
//   }

//   // 2. Upload the image to supabase storage bucket
//   const { error: storageError } = await supabase.storage
//     .from("cabin-images")
//     .upload(imageName, newCabin.image);

//   // 3. Delete the cabin if there's error uploading the corresponding image to the bucket
//   if (storageError) {
//     await supabase.from("cabins").delete().eq("id", data.id);
//     console.error(storageError);
//     throw new Error(
//       "Cabin image could not be uploaded and the cabin was not created",
//     );
//   }

//   return data;
// }

export const getCabinById = async (cabinId) => {
  const { data: cabin, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", cabinId)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error, "Cabin could not be found!");
  }
  return cabin;
};

export async function deleteCabin(id) {
  const cabinToBeDeleted = await getCabinById(id);
  const imagePath = cabinToBeDeleted.image.split("/").pop();

  const { data, error: cabinDeleteError } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id);

  if (cabinDeleteError) {
    console.error(cabinDeleteError);
    throw new Error("Cabin could not be deleted");
  }

  // If cabin was successfully deleted, then delete the corresponding image in the storage
  const { error: imageDeleteError } = await supabase.storage
    .from("cabin-images")
    .remove([imagePath]);

  if (imageDeleteError) console.error(imageDeleteError);

  return data;
}

// export async function createEditCabin(newCabin, id) {
//   const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
//   console.log(newCabin);

//   const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
//     "/",
//     "",
//   );
//   console.log(imageName);

//   const imagePath = hasImagePath
//     ? newCabin.image
//     : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

//   console.log(imagePath);

//   // 1. Create/edit cabin
//   let query = supabase.from("cabins");

//   // A) CREATE
//   if (!id) query = query.insert([{ ...newCabin, image: imagePath }]).select();
//   console.log({ ...newCabin, image: imagePath });

//   // B) EDIT
//   if (id)
//     query = query
//       .update({ ...newCabin, image: imagePath })
//       .eq("id", id)
//       .select();

//   const { data, error } = await query.single();

//   if (error) {
//     console.error(error);
//     throw new Error("Cabin could not be created");
//   }

//   // 2. Upload image
//   const { error: storageError } = await supabase.storage
//     .from("cabin-images")
//     .upload(imageName, newCabin.image);

//   // 3. Delete the cabin if there was an error uploading image
//   if (storageError) {
//     await supabase.from("cabins").delete().eq("id", data.id);
//     console.error(storageError);
//     throw new Error(
//       "Cabin image could not be uploaded and the cabin was not created",
//     );
//   }

//   return data;
// }
