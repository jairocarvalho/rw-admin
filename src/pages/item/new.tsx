import {
  API_DELETE_UPLOAD_URL,
  API_ITEM_NEW_URL,
  API_UPLOAD_URL,
} from "@/config/api";
import { getLocalStorage } from "@/utils/localStorage";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { compressImage } from "@/utils/compressImage";
import { UPLOAD_URL } from "@/config/urls";
import { Header } from "@/components/header";
import { ImageTypes } from "@/types";
import { imageTypeRegex } from "@/utils/validate";
import { Loader2 } from "lucide-react";

interface Data {
  title: string;
  description: string;
  users_permissions_user: number;
}

export default function Home() {
  const userId = getLocalStorage("userId");
  const jwtToken = getLocalStorage("jwt_token");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialState = useMemo(
    () => ({
      title: "",
      description: "",
      users_permissions_user: Number(userId),
    }),
    [userId]
  );

  const [imageFiles, setImageFiles] = useState([]);
  const [images, setImages] = useState([]);

  const router = useRouter();

  const [data, setData] = useState<Data>(initialState);

  useEffect(() => {
    const fileReaders: FileReader[] = [];
    let isCancel = false;
    if (imageFiles.length) {
      const promises = imageFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReaders.push(fileReader);
          fileReader.onload = (e) => {
            const { result } = e.target;
            if (result) {
              resolve(result);
            }
          };
          fileReader.onabort = () => {
            reject(new Error("File reading aborted"));
          };
          fileReader.onerror = () => {
            reject(new Error("Failed to read file"));
          };
          fileReader.readAsDataURL(file);
        });
      });
      Promise.all(promises)
        .then((images) => {
          if (!isCancel) {
            setImages(images);
          }
        })
        .catch((reason) => {});
    }
    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [imageFiles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    setData({ ...data, [input]: (e.target as HTMLInputElement).value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((data && data.title !== "") || (data && data.description !== "")) {
      setIsLoading(true);
      let formData = data;
      formData = {
        ...formData,
        users_permissions_user: data.users_permissions_user,
      };

      axios
        .post(
          API_ITEM_NEW_URL,
          { data: formData },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        )
        .then((response) => {
          const { id } = response.data.data;
          console.log("id", id);
          addImagesToPost(imageFiles, id);
          setIsLoading(false);
          router.push("/admin");
        });
    }
  };

  const addImagesToPost = async (images: any[], itemId: string | Blob) => {
    const bodyFormData = new FormData();

    bodyFormData.append("ref", "api::item.item");
    bodyFormData.append("refId", itemId);
    bodyFormData.append("field", "images");

    images.map((image) => {
      bodyFormData.append(`files`, image, image.name);
    });

    try {
      return await axios.post(API_UPLOAD_URL, bodyFormData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      console.error("error while adding images to post", error);
      return error.response;
    }
  };

  const handleUpload = async (e: { target: { files: any } }) => {
    const { files } = e.target;
    console.log("files", files);

    // No files selected
    if (!files.length) return;

    // We'll store the files in this data transfer object
    const dataTransfer = new DataTransfer();
    // For every file in the files list
    for (const file of files) {
      // We don't have to compress files that aren't images
      if (!file.type.startsWith("image")) {
        // Ignore this file, but do add it to our result
        dataTransfer.items.add(file);
        continue;
      }

      const compressedFile = await compressImage(file);
      console.log("compressedFile", compressedFile);

      // Save back the compressed file instead of the original file
      dataTransfer.items.add(compressedFile);
    }

    // Set value of the file input to our new files list
    e.target.files = dataTransfer.files;

    const validImageFiles: File[] | ((prevState: never[]) => never[]) = [];

    console.log(dataTransfer.items);
    console.log(dataTransfer.files);
    console.log(Array.from(dataTransfer.files));

    Array.from(dataTransfer.files).forEach((file) => {
      if (file.type.match(imageTypeRegex)) {
        validImageFiles.push(file);
      }
    });

    if (validImageFiles.length) {
      setImageFiles(validImageFiles);
      return;
    }

    alert("As imagens selecionadas não são de tipo válido!");
  };

  return (
    <main className="max-w-6xl m-auto flex justify-center align-center flex-col">
      <Header />

      <div className="flex flex-1 justify-between mb-4 pl-2 pr-2">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl mb-5">
          New item
        </h1>
        <Button
          className="bg-gray-600 hover:bg-gray-700"
          onClick={() => history.back()}
        >
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
        <div className="gap-1">
          <Label>Title</Label>
          <Input
            value={data?.title}
            onChange={(e) => handleChange(e, "title")}
          />
        </div>
        <div className="gap-1">
          <Label>Description</Label>
          <Textarea
            value={data?.description}
            onChange={(e) => handleChange(e, "description")}
          />
        </div>

        <div>
          {images.length > 0 ? (
            <div className="border-1 border-gray-400">
              <div className="flex flex-wrap w-[100%]">
                {images.map((image, index) => {
                  return (
                    <Image
                      key={index}
                      src={image}
                      alt=""
                      className="w-[20%] object-cover rounded"
                      width={100}
                      height={100}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
          <Input
            className="mt-3"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleUpload}
            multiple
          />
        </div>
        <Button type="submit">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && "Add"}
        </Button>
      </form>
    </main>
  );
}
function preventDefault() {
  throw new Error("Function not implemented.");
}
