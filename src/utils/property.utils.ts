import { PropertyType } from "@/lib/types";

export function getBadgeClass(type: PropertyType): string {
  const map: Record<PropertyType, string> = {
    HOUSE: 'bg-blue-50 text-blue-700 ring-blue-200',
    APARTMENT: 'bg-violet-50 text-violet-700 ring-violet-200',
    TOWNHOUSE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    LAND: 'bg-amber-50 text-amber-700 ring-amber-200',
  };
  return map[type] || map.HOUSE;
}


export function getTypeIcon(type: PropertyType): string {
  const icons: Record<PropertyType, string> = {
    HOUSE: 'https://www.michaelzingraf.com/storage/images/xOWyG9KJ1jqmMPFgv1KoscsYpkoQ0lCDD2WTi8WE.jpeg',
    APARTMENT: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbtO3SURHeGrHHgME6hnKtKXexCZX48gUzVP-kHHg5Ww7_3c4UrID3c1aUnZrEsoWXqgUCtzV2Bv9CI97CH277zu-GJq_H7QL3xF1Dx1K30hS4Pr5Sdukt2m3Be98dJIcgXKGT2WAm6YTf/s1600/Civilluxuaryresidencep1.jpg',
    TOWNHOUSE: 'https://www.colibrirealestate.com/wp-content/uploads/2023/01/townhouses.webp',
    LAND: 'https://s3.ap-south-1.amazonaws.com/qbcon.in/uploads/blogpost/1748336702_85641_blog.jpg',
  };
  return icons[type];
}