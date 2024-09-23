export interface ImageTypes {
  id: number;
  attributes: {
    alternativeText: string;
    caption: string;
    createdAt: string;
    ext: string;
    formats: string;
    hash: string;
    height: number;
    mime: string;
    name: string;
    previewUrl: string;
    provider: string;
    provider_metadata: string;
    related: [];
    size: number;
    updatedAt: string;
    url: string;
    width: number;
  };
}

export interface UserTypes {
  id: number;
  attributes: {
    blocked: boolean;
    confirmed: boolean;
    createdAt: string;
    email: string;
    name: string;
    provider: string;
    updatedAt: string;
    username: string;
  };
}

export interface ItemTypes {
  id: number;
  attributes: {
    createdAt: string;
    description: string;
    images: ImageTypes[];
    publishedAt: string;
    title: string;
    updatedAt: string;
    users_permissions_user: UserTypes[];
  };
}
