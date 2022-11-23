//File upload will not fully work since i haven't created api service 
//but from UI perspective it completed and it will be working once API will respond
import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.css']
})
export class UploadDetailsComponent {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  searchTerm:any;
  fileInfos?: Observable<any>;
  fileURL: any;

  constructor(private uploadService: FileUploadService) { }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  ngOnInit():void{
    this.uploadService.getFiles().subscribe({
      next: (event: any) => {
        console.log(event);
        this.fileURL = event
      },
      error: (err: any) => {
        
      }
    });
  }
  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });

      
      }

      this.selectedFiles = undefined;
    }
  }

  sortbytitle(){
    this.fileURL.sort((a:any,b:any) => (a.title.toLowerCase() < b.title.toLowerCase()) ? -1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? 1 : 0));
  }

}
