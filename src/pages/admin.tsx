import { API_ITEM_DELETE_URL, API_USER_ITEMS_URL } from "@/config/api";
import { getLocalStorage } from "@/utils/localStorage";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/header";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

interface Item {
  id: string;
  attributes: {
    title: string;
    description: string;
  };
}

export default function Home() {
  const userId = getLocalStorage("userId");
  const jwtToken = getLocalStorage("jwt_token");

  const [itemsData, setItemsData] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasDeleteItem, setHasDeleteItem] = useState<number>(0);

  const rounter = useRouter();

  useEffect(() => {
    axios
      .get(API_USER_ITEMS_URL(Number(userId)), {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setItemsData(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }, [jwtToken, userId]);

  const handleClick = (itemId: number) => {
    rounter.push(`/item/${itemId}`);
  };

  const handleNewClick = () => {
    rounter.push(`/item/new`);
  };

  const handleDialog = (itemId: number) => {
    setIsOpen(true);
    setHasDeleteItem(itemId);
  };

  const handleDelete = (itemId: number) => {
    if (hasDeleteItem != 0) {
      axios
        .delete(API_ITEM_DELETE_URL(itemId), {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then(() => {
          setIsOpen(false);
          setHasDeleteItem(0);
          rounter.reload();
        })
        .catch(() => {
          setIsOpen(false);
          setHasDeleteItem(0);
        });
    }
  };

  return (
    <main className="max-w-6xl m-auto">
      <Header />
      <div className="flex flex-1 justify-between mb-4 pl-2 pr-2">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl mb-5">
          My items
        </h1>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleNewClick}
        >
          New
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-gray-900">Title</TableHead>
            <TableHead className="font-medium text-gray-900">
              Description
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsData.length > 0 &&
            itemsData.map((item: Item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[50%]">
                  {item.attributes.title}
                </TableCell>
                <TableCell>{item.attributes.description}</TableCell>
                <TableCell className="text-right w-[100%]">
                  <div className="flex align-center justify-end">
                    <Button
                      className="mr-2"
                      onClick={() => handleClick(Number(item.id))}
                      variant="outline"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDialog(Number(item.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove item</DialogTitle>
            <DialogDescription>Do you want to remove?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => handleDelete(hasDeleteItem)} type="submit">
              Cofirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
