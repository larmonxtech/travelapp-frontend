import { Component, inject } from '@angular/core';
import { Tag } from '../../model/tag';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent {
  protected tags : Tag[] = [];
  private readonly tagService = inject(TagService);

  ngOnInit() : void{
    this.tagService.findAll().subscribe(data => this.tags = data);
  }
}
