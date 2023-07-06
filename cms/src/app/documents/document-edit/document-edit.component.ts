import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {

}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        console.log(id)
        if (id === null || id === undefined) {
          this.editMode = false;
          return;
        }
        this.originalDocument = this.documentService.getDocument(id);

        if (this.originalDocument === null) {
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    )
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document(
      null,
      value.id,
      value.name,
      value.description,
      value.url,
      value.children
    );

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['documents']);
  }
}
