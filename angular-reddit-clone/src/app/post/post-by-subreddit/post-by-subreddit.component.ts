import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from "../../shared/post.service";
import { PostModel } from '../../shared/post-model';

@Component({
  selector: 'app-post-by-subreddit',
  templateUrl: './post-by-subreddit.component.html',
  styleUrls: ['./post-by-subreddit.component.css']
})
export class PostBySubredditComponent implements OnInit {

  posts: Array<PostModel> = [];
  redditId: number;

  constructor(private postService: PostService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.redditId = this.activatedRoute.snapshot.params.id;
    this.postService.getPostsBySubreddit(this.redditId).subscribe(data => {
      this.posts = data;
    });
    
  }

}
