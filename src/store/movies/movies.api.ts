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

interface GetTodayMoviesResponseSuccess extends ApiResponseSuccess {
  films: Movie[];
}

interface GetMovieResponseSuccess {
  film: Movie;
}

interface Seat {
  row: number;
  column: number;
}

type PayedTicket = {
  filmId: string;
  seance: Seance;
} & Pick<User, 'phone'> &
  Seat;

type Seance = Pick<Schedule, 'date'> & Pick<ScheduleSeance, 'time'>;

interface ScheduleSeance {
  // 'hh:mm';
  time: string;
  hall: {
    name: string;
    places: [];
  };
  payedTickets: PayedTicket[];
}

interface Schedule {
  // 'dd.mm.yy'
  date: string;
  seances: ScheduleSeance[];
}

interface getMovieScheduleResponseSuccess {
  schedules: Schedule[];
}

interface DebitCard {
  // '#### ####'
  pan: string;
  // '##/##'
  expireDate: string;
  cvv: string;
}

interface BuyTicketPayload {
  filmId: string;
  person: Pick<Required<User>, 'firstname' | 'lastname' | 'phone'>;
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

interface BuyTicketResponseSuccess {
  order: PurchasedTicket;
}

interface GetOrdersResponseSuccess {
  orders: PurchasedTicket[];
}

export const moviesApi = {
  getTodayMovies() {
    return axios.get<GetTodayMoviesResponseSuccess>('/cinema/today');
  },
  getMovie(movieId: number | string) {
    return axios.get<GetMovieResponseSuccess>(`/cinema/film/${movieId}`);
  },
  getMovieSchedule(movieId: number | string) {
    return axios.get<getMovieScheduleResponseSuccess>(`/cinema/film/${movieId}/schedule`);
  },
  buyTicket(payload: BuyTicketPayload) {
    return axios.post<BuyTicketResponseSuccess>('/cinema/payment', payload);
  },
  getTickets() {
    return axios.get<GetOrdersResponseSuccess>('/cinema/orders');
  },
};
