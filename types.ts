export interface Category {
  id: string,
  title: string,
  description: string
}

export interface CategoryMutation {
  title: string,
  description: string
}

export interface Location {
  id: string,
  title: string,
  description: string
}

export interface LocationMutation {
  title: string,
  description: string
}
export interface Item {
  id: string,
  title: string,
  category_id: string,
  location_id: string,
  name: string,
  description: string,
  date: string | null,
  image: string | null,
}
export interface ItemMutation {
  title: string,
  category_id: string,
  location_id: string,
  name: string,
  description: string,
  date: string,
  image: string | null,
}