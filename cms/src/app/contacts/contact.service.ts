import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { MOCKCONTACTS } from './MOCKCONTACTS';
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

  localUrl: string = 'http://localhost:3000/contacts/';

  firebaseUrl: string = 'https://wdd430-project1-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    // return this.contacts.contact
    this.http.get<{message: string, contacts: Contact[]}>(this.localUrl).subscribe(
      (response: {message: string, contacts: Contact[]}) => {
        this.contacts = response.contacts;
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
    // this.getContacts();
    if (this.contacts.length > 0) {
      console.log(this.contacts.length);
      for (let i = 0; i < this.contacts.length; i++) {
        if (this.contacts[i].id == id || this.contacts[i]._id == id) {
          return this.contacts[i]
        }
      }
    }
    return null
  }

  deleteContact(contact: Contact) {
    // if (!contact) {
    //    return;
    // }
    // const pos = this.contacts.indexOf(contact);
    // if (pos < 0) {
    //    return;
    // }
    // this.contacts.splice(pos, 1);
    // const contactsList = this.contacts.slice()
    // this.contactListChangedEvent.next(this.storeContacts());

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(this.localUrl + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
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
    // if (newContact === undefined || null) {
    //   return
    // }
    // this.maxContactId++;
    // newContact.id = `${this.maxContactId}`;
    // this.contacts.push(newContact);
    // const contactsList = this.contacts.slice();
    // this.contactListChangedEvent.next(this.storeContacts());

    if (!newContact) {
      return;
    }

    // make sure id of the new Contact is empty
    newContact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>(this.localUrl,
      newContact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.sortAndSend()
        }
      );
   }

   updateContact(originalContact: Contact, newContact: Contact) {
    // if (originalContact === undefined || newContact === undefined) {
    //   return
    // }

    // const pos = this.contacts.indexOf(originalContact);
    // if (pos < 0) {
    //   return
    // }

    // newContact.id = originalContact.id;
    // this.contacts[pos] = newContact;
    // const contactsList = this.contacts.slice();
    // this.contactListChangedEvent.next(this.storeContacts());

    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put(this.localUrl + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend()
        }
      );
   }

   sortAndSend() {
    if (Array.isArray(this.contacts)) {
      this.contacts.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      this.contactListChangedEvent.next(this.contacts.slice());
    }
  }

  //  storeContacts() {
  //   const data = JSON.stringify(this.contacts);
  //   return this.http.put(
  //     'https://wdd430-project1-default-rtdb.firebaseio.com/contacts.json',
  //     data,
  //     {
  //       headers: new HttpHeaders({'Content-Type': 'application/json'})
  //     }).subscribe(
  //       () => {
  //         this.contactListChangedEvent.next(this.contacts.slice());
  //       }
  //     )
  //  }
}
