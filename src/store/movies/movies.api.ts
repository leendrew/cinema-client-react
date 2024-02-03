import { axios } from '@/config';
import type { ApiResponseSuccess } from '@/config';
import type { User } from '../user';

type ActorProfession = 'ACTOR' | 'DIRECTOR';

interface MovieMember {
  id: string;
  fullName: string;
}

interface Actor extends MovieMember {
  professions: ActorProfession[];
}

interface Director {
  professions: ActorProfession[];
}

interface Country {
  id: number;
  code: string;
  code2: string;
  name: string;
}

export interface Movie {
  id: string;
  name: string;
  originalName: string;
  description: string;
  releaseDate: string;
  actors: Actor[];
  directors: Director[];
  runtime: number;
  ageRating: string;
  genres: string[];
  userRatings: {
    kinopoisk: string;
    imdb: string;
  };
  img: string;
  country: Country;
}

interface GetTodayResponse extends ApiResponseSuccess {
  films: Movie[];
}

interface GetOneResponse extends ApiResponseSuccess {
  film: Movie;
}

export interface Seat {
  row: number;
  column: number;
}

type PayedTicket = {
  filmId: Movie['id'];
  seance: Seance;
} & Pick<User, 'phone'> &
  Seat;

type Seance = Pick<Schedule, 'date'> & Pick<ScheduleSeance, 'time'>;

type SeatType = 'BLOCKED' | 'ECONOM' | 'COMFORT';

export interface Place {
  price: number;
  type: SeatType;
}

export interface Hall {
  name: string;
  places: Place[][];
}

export interface ScheduleSeance {
  // 'hh:mm';
  time: string;
  hall: Hall;
  payedTickets: PayedTicket[];
}

interface Schedule {
  // 'dd.mm.yy'
  date: string;
  seances: ScheduleSeance[];
}

interface GetScheduleResponse extends ApiResponseSuccess {
  schedules: Schedule[];
}

export type BuyTicketPerson = Pick<Required<User>, 'firstname' | 'lastname' | 'phone'> &
  Pick<User, 'middlename'>;

export interface DebitCard {
  // '#### ####'
  pan: string;
  // '##/##'
  expireDate: string;
  cvv: string;
}

export interface BuyTicketPayload {
  filmId: Movie['id'];
  person: BuyTicketPerson;
  debitCard: DebitCard;
  seance: Seance;
  tickets: Seat[];
}

type TicketStatus = 'PAYED';

type PurchasedTicket = {
  filmName: string;
  orderNumber: number;
  tickets: PayedTicket[];
} & Pick<User, 'phone'> & { status: TicketStatus };

export interface BuyTicketResponse extends ApiResponseSuccess {
  order: PurchasedTicket;
}

interface GetOrdersResponse extends ApiResponseSuccess {
  orders: PurchasedTicket[];
}

export const moviesApi = {
  getToday() {
    return axios.get<GetTodayResponse>('/cinema/today');
  },
  getOne(movieId: number | string) {
    return axios.get<GetOneResponse>(`/cinema/film/${movieId}`);
  },
  getSchedule(movieId: number | string) {
    return axios.get<GetScheduleResponse>(`/cinema/film/${movieId}/schedule`);
  },
  buyTicket(payload: BuyTicketPayload) {
    return axios.post<BuyTicketResponse>('/cinema/payment', payload);
  },
  getTickets() {
    return axios.get<GetOrdersResponse>('/cinema/orders');
  },
};
