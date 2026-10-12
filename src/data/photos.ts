import type { Localized } from './types'
import amstelRide from '../assets/photos/amstel-ride.webp'
import bakeOff from '../assets/photos/bake-off.webp'
import bikeFair from '../assets/photos/bike-fair.webp'
import bookClub from '../assets/photos/book-club.webp'
import cargoBike from '../assets/photos/cargo-bike.webp'
import newApp from '../assets/photos/new-app.webp'
import officeDog from '../assets/photos/office-dog.webp'
import paella from '../assets/photos/paella.webp'
import phishing from '../assets/photos/phishing.webp'
import playlist from '../assets/photos/playlist.webp'
import pubQuiz from '../assets/photos/pub-quiz.webp'
import rooftopHarvest from '../assets/photos/rooftop-harvest.webp'

export interface StockPhoto {
  src: string
  alt: Localized<string>
  /** Where the photo comes from; all photos are used under the Unsplash License (see CREDITS.md). */
  source: 'Unsplash'
}

/** Stock photos bundled with the app, used by the seed posts. */
export const PHOTOS: Record<string, StockPhoto> = {
  'amstel-ride': {
    src: amstelRide,
    source: 'Unsplash',
    alt: { nl: 'Twee wielrenners op een weg langs de duinen', en: 'Two cyclists on a road along the dunes', de: 'Zwei Radfahrerinnen auf einer Straße an den Dünen' },
  },
  'bake-off': {
    src: bakeOff,
    source: 'Unsplash',
    alt: { nl: 'Een punt taart met frambozen', en: 'A slice of cake with raspberries', de: 'Ein Stück Torte mit Himbeeren' },
  },
  'cargo-bike': {
    src: cargoBike,
    source: 'Unsplash',
    alt: { nl: 'Een fiets tegen een donkere muur', en: 'A bicycle against a dark wall', de: 'Ein Fahrrad vor einer dunklen Wand' },
  },
  'office-dog': {
    src: officeDog,
    source: 'Unsplash',
    alt: { nl: 'Een vrolijke border collie', en: 'A happy border collie', de: 'Ein fröhlicher Border Collie' },
  },
  'new-app': {
    src: newApp,
    source: 'Unsplash',
    alt: { nl: 'Iemand werkt met een laptop en een telefoon', en: 'Someone working with a laptop and a phone', de: 'Jemand arbeitet mit Laptop und Handy' },
  },
  'rooftop-harvest': {
    src: rooftopHarvest,
    source: 'Unsplash',
    alt: { nl: 'Manden met verse groenten', en: 'Baskets of fresh vegetables', de: 'Körbe mit frischem Gemüse' },
  },
  'pub-quiz': {
    src: pubQuiz,
    source: 'Unsplash',
    alt: { nl: 'Een gezellige bar met houten tafels', en: 'A cosy bar with wooden tables', de: 'Eine gemütliche Bar mit Holztischen' },
  },
  'bike-fair': {
    src: bikeFair,
    source: 'Unsplash',
    alt: { nl: 'Een blauwe fiets tegen een witte muur', en: 'A blue bicycle against a white wall', de: 'Ein blaues Fahrrad vor einer weißen Wand' },
  },
  'book-club': {
    src: bookClub,
    source: 'Unsplash',
    alt: { nl: 'Boekenkasten vol boeken', en: 'Bookshelves full of books', de: 'Bücherregale voller Bücher' },
  },
  phishing: {
    src: phishing,
    source: 'Unsplash',
    alt: { nl: 'Een scherm met een printplaatpatroon', en: 'A screen with a circuit board pattern', de: 'Ein Bildschirm mit Platinenmuster' },
  },
  paella: {
    src: paella,
    source: 'Unsplash',
    alt: { nl: 'Een pan paella met citroen', en: 'A pan of paella with lemon', de: 'Eine Pfanne Paella mit Zitrone' },
  },
  playlist: {
    src: playlist,
    source: 'Unsplash',
    alt: { nl: 'Een retro microfoon', en: 'A retro microphone', de: 'Ein Retro-Mikrofon' },
  },
}
