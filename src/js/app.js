import HometaskSwitch from './HometaskSwitch';
import LocalData from './LocalData';
import Trello from './trello/Trello';
import { data as trelloData } from './trello/data';
import GalleryForm from './image-manager/GalleryForm';

const hometaskSwitch = new HometaskSwitch();
hometaskSwitch.switchTaskManually('1');

const localTrelloData = LocalData.load('trello');
const trello = new Trello(localTrelloData || trelloData);

const galleryForm = new GalleryForm();
galleryForm.addEventListeners();
