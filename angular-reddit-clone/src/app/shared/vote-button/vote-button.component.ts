import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from '../post-model';
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { VotePayload } from '../vote-payload';
import { VoteService } from '../vote.service';
import { PostService } from '../post.service';
import { AuthService } from "../../auth/shared/auth.service";
import { ToastrService } from 'ngx-toastr';
import { VoteType } from '../vote-type';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input() post: PostModel;
  votePayload: VotePayload;
  upVoteColor: string;
  downVoteColor: string;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  constructor(private voteService: VoteService,
            private authService: AuthService,
            private postService: PostService, private toastr: ToastrService) { 

              this.votePayload = {
                voteType: undefined,
                postId: undefined
              }
            }

  ngOnInit(): void {
  }

  upvotePost() {
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
  }

  downvotePost() {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
  }
  private vote() {
    this.votePayload.postId = this.post.id;
    this.voteService.vote(this.votePayload).subscribe(() => {
      this.updateVoteDetails();
      this.upVoteColor = this.votePayload.voteType == VoteType.UPVOTE ? 'green' : '';
      this.downVoteColor = this.votePayload.voteType == VoteType.DOWNVOTE ? 'red' : '';
    }, error => {
      this.toastr.error("You have already given the same vote");
      throwError(error);
    });
  }

  private updateVoteDetails() {
    this.postService.getPost(this.post.id).subscribe(post => {
      this.post = post;
      console.log(this.post.downVote);
      console.log(this.post.upVote);
    });
  }

}
