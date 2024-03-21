import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {concatMap, Observable} from "rxjs";
import { User } from '@angular/fire/auth';
import {ImageUploadService} from "../../services/image-upload.service";
import {HotToastService} from "@ngneat/hot-toast";
import {FormControl, FormGroup} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ProfileUser} from "../../models/user-profile";

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements  OnInit{
  user$ = this.userService.currentUserProfile$;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });
  constructor(
    private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private userService: UsersService
    ) {}

  uploadImage(event: any, user: ProfileUser){
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      this.toast.observe(
        {
          loading: 'Image is being uploaded...',
          success: 'Image uploaded!',
          error:'There was an error in uploading'
        }
      ),
      concatMap((photoURL) => this.userService.updateUser({uid: user.uid, photoURL}))
    ).subscribe();
  }

  ngOnInit() {
    this.userService.currentUserProfile$
      .pipe(untilDestroyed(this))
      .subscribe((user)=>{
      this.profileForm.patchValue({...user})
    });
  }

  saveProfile() {
    const { uid, ...data } = this.profileForm.value;
    if (!uid) {
      return;
    }
    const profileData = this.profileForm.value;
    this.userService.updateUser({ uid, ...data } as any).pipe(
      this.toast.observe({
        loading: 'Saving profile data...',
        success: 'Profile updated successfully',
        error: 'There was an error in updating the profile',
      })
    ).subscribe();
  }
}
