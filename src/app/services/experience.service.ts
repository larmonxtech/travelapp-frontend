import { Injectable } from '@angular/core';
import { GenericSignalService } from './generic-signal.service';
import { environment } from '../../environments/environment';
import { Experience } from '../model/experience';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService extends GenericSignalService<Experience> {
  protected override url:string = `${environment.HOST}/experiences`;
}
