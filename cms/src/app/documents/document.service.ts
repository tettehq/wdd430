import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[];
  documentChangedEvent = new EventEmitter<Document[]>();

  documentSelectedEvent = new EventEmitter<Document>();

  documentListChangedEvent = new Subject<Document[]>();

  maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].id == id) {
        return this.documents[i]
      }
    }
    return null
  }

  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    const documentsList = this.documents.slice();
    this.documentListChangedEvent.next(documentsList);
 }

 getMaxId(): number {
  let maxId = 0;
  this.documents.forEach(
    (document: Document) => {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId
      }
    }
  )
  return maxId;
 }

 addDocument(newDocument: Document) {
  if (newDocument === undefined || newDocument === null) {
    // console.log('Stuck here!');
    return
  }
  this.maxDocumentId++;
  // console.log(this.maxDocumentId);
  newDocument.id = `${this.maxDocumentId}`;
  this.documents.push(newDocument);
  const documentsList = this.documents.slice();
  this.documentListChangedEvent.next(documentsList);
 }

 updateDocument(originalDocument: Document, newDocument: Document) {
  if (originalDocument === undefined || newDocument === undefined) {
    return
  }

  const pos = this.documents.indexOf(originalDocument);
  if (pos < 0) {
    return
  }

  newDocument.id = originalDocument.id;
  this.documents[pos] = newDocument;
  const documentsList = this.documents.slice();
  this.documentListChangedEvent.next(documentsList);
 }
}
