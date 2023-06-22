import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];

  contactChangedEvent = new EventEmitter<Contact[]>();

  contactSelectedEvent = new EventEmitter<Contact>();

  contactListChangedEvent = new Subject<any>();

  maxContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    // return this.contacts.contact
    this.http.get<Contact[]>('https://wdd430-project1-default-rtdb.firebaseio.com/contacts.json').subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.contactListChangedEvent.next(this.contacts.slice());
        console.log(typeof(this.contacts));
      },
      (error: any) => {
        console.log('An error occurred '+ error);
      }
    )
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].id == id) {
        return this.contacts[i]
      }
    }
    return null
  }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    const contactsList = this.contacts.slice()
    this.contactListChangedEvent.next(this.storeContacts());
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(
      (contact: Contact) => {
        const currentId = +contact.id;
        if (currentId > maxId) {
          maxId = currentId
        }
      }
    )
    return maxId;
   }

   addContact(newContact: Contact) {
    if (newContact === undefined || null) {
      return
    }
    this.maxContactId++;
    newContact.id = `${this.maxContactId}`;
    this.contacts.push(newContact);
    const contactsList = this.contacts.slice();
    this.contactListChangedEvent.next(this.storeContacts());
   }

   updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact === undefined || newContact === undefined) {
      return
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactsList = this.contacts.slice();
    this.contactListChangedEvent.next(this.storeContacts());
   }

   storeContacts() {
    const data = JSON.stringify(this.contacts);
    return this.http.put(
      'https://wdd430-project1-default-rtdb.firebaseio.com/contacts.json',
      data,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }).subscribe(
        () => {
          this.contactListChangedEvent.next(this.contacts.slice());
        }
      )
   }
}
