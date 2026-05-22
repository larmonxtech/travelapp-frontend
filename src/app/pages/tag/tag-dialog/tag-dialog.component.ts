import { Component, inject, signal } from '@angular/core';
import { TagService } from '../../../services/tag.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-tag-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './tag-dialog.component.html',
  styleUrl: './tag-dialog.component.css',
})
export class TagDialogComponent {
  private readonly tagService = inject(TagService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TagDialogComponent>);

  protected $tag = signal({ ... this.data });
  
  operate(){
    const tag = this.$tag();
    const isEdit = tag != null && tag.idTag > 0;
    const msg = isEdit ? 'UPDATED' : 'CREATED';
    const operation$ = isEdit ? this.tagService.update(tag.idTag, tag) : this.tagService.save(tag); 

    operation$.pipe(
      switchMap(() => this.tagService.findAll()),
      tap(data => this.tagService.setListChange(data)),
      tap( () => this.tagService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close(){
    this.dialogRef.close();
  }
}
