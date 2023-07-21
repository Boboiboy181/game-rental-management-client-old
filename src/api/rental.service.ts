import { CreateRental } from '../types/create-rental.type';
import { Rental } from '../types/rental.type';
import { UpdateRental } from '../types/update-rental.type';
import api from './axios.config';

export const getRentals = async (): Promise<Rental[]> => {
  const { data }: { data: Rental[] } = await api.get('rental');
  return data;
};

export const delelteRental = async (id: string): Promise<void> => {
  await api.delete(`rental/${id}`);
};

export const createRental = async (
  createRental: CreateRental,
): Promise<Rental> => {
  const { data }: { data: Rental } = await api.post('rental', {
    ...createRental,
  });
  return data;
};

export const updateRental = async (
  id: string | undefined,
  updateRental: UpdateRental,
): Promise<Rental> => {
  const { data }: { data: Rental } = await api.patch(`rental/${id}`, {
    ...updateRental,
  });
  return data;
};

export const getRentalById = async (
  id: string | undefined,
): Promise<Rental> => {
  const { data }: { data: Rental } = await api.get(`rental/${id}`);
  return data;
};
