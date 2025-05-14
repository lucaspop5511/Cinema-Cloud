// Cinema configurations for scraping
const CINEMAS = {
  'cinema-city': {
    name: 'Cinema City',
    baseUrl: 'https://www.cinemacity.ro',
    locations: [
      {
        id: 1815,
        name: 'Cluj VIVO',
        city: 'Cluj-Napoca',
        address: 'Strada Avram Iancu 492-500, Cluj-Napoca',
        phone: '0314 130 260',
        slug: 'cluj-vivo'
      },
      {
        id: 1806,
        name: 'București AFI Cotroceni',
        city: 'București',
        address: 'Bulevardul Vasile Milea 4, București',
        phone: '021 327 27 27',
        slug: 'bucuresti-afi'
      },
      {
        id: 1808,
        name: 'București Mega Mall',
        city: 'București',
        address: 'Bulevardul Pierre de Coubertin 3-5, București',
        phone: '021 327 27 27',
        slug: 'bucuresti-mega'
      },
      {
        id: 1820,
        name: 'Timișoara',
        city: 'Timișoara',
        address: 'Strada Arhitect László Székely 10A, Timișoara',
        phone: '0356 111 111',
        slug: 'timisoara'
      },
      {
        id: 1807,
        name: 'București Sun Plaza',
        city: 'București',
        address: 'Calea Văcărești 391, București',
        phone: '021 327 27 27',
        slug: 'bucuresti-sun-plaza'
      }
    ]
  },
  'movieplex': {
    name: 'Movieplex',
    baseUrl: 'https://www.movieplex.ro',
    locations: [
      {
        id: 1,
        name: 'Plaza Romania',
        city: 'București',
        address: 'Bulevardul Timișoara 26, București',
        phone: '021 431 00 00',
        slug: 'bucuresti'
      },
      {
        id: 2,
        name: 'Băneasa',
        city: 'București',
        address: 'Șoseaua București-Ploiești 42D, București',
        phone: '021 317 28 90',
        slug: 'baneasa'
      },
      {
        id: 3,
        name: 'Constanța',
        city: 'Constanța',
        address: 'Aleea Magnolie 2, Constanța',
        phone: '0241 551 200',
        slug: 'constanta'
      }
    ]
  }
};

module.exports = { CINEMAS };