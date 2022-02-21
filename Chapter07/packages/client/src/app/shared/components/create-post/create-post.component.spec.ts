import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PostEvent } from '../..';
import { CreatePostComponent } from './create-post.component';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  const mockFile = new File([''], 'image.jpeg', { type: 'image/jpeg' });
  const mockEvent = { target: { files: [mockFile] } };
  function triggerSelectImage() {
    const selectImageInput: DebugElement = fixture.debugElement
      .query(By.css('input:nth-of-type(1)'));
    selectImageInput.triggerEventHandler('change', mockEvent);
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render progress bar when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const progressBarElm = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(progressBarElm).toBeTruthy();
  });
  it('should render auth user image', () => {
    component.authUser = {
      id: '#1', image: 'fake-image-url'
    };
    fixture.detectChanges();
    const imageElm = fixture.debugElement.query(By.css('img'));
    expect(imageElm.attributes['src']).toEqual('fake-image-url');
  });
  it('should render auth user first name on placeholder', () => {
    const fakeUser = {
      id: '#1', fullName: 'Ahmed Bouchefra'
    };
    component.authUser = fakeUser;
    fixture.detectChanges();
    const txtareaElm = fixture.debugElement.query(By.css('textarea'));
    expect(txtareaElm.attributes['placeholder']).toContain(component.userFirstName);
  });
  it('should emit post on button click', () => {
    const fakeUser = {
      id: '#1', fullName: 'Ahmed Bouchefra'
    };
    const postText = 'Post #1';
    component.authUser = fakeUser;
    component.postText.nativeElement.value = postText;
    spyOn(component.post, 'emit');
    fixture.detectChanges();
    const buttonElm = fixture.nativeElement
      .querySelector('button:nth-of-type(1)');
    buttonElm.click();
    expect(component.post.emit).toHaveBeenCalledOnceWith({
      text: postText,
      image: null
    });
    expect(component.postText.nativeElement.value).toEqual('');
  });
  it('should set imageFile property on file select', () => {
    triggerSelectImage();
    expect(component.imageFile).toEqual(mockFile);
  });
  it('should render selected image name', () => {
    triggerSelectImage();
    fixture.detectChanges();
    const btn: HTMLElement = fixture.nativeElement
      .querySelector('button:nth-of-type(2)');
    expect(btn.textContent)
      .toContain(component.imageFile!.name);
  });
});
