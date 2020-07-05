import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBySubredditComponent } from './post-by-subreddit.component';

describe('PostBySubredditComponent', () => {
  let component: PostBySubredditComponent;
  let fixture: ComponentFixture<PostBySubredditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostBySubredditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostBySubredditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
