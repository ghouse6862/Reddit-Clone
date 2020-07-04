package com.example.springredditclone.service;

import com.example.springredditclone.dto.CommentDto;
import com.example.springredditclone.exception.SpringRedditException;
import com.example.springredditclone.mapper.CommentMapper;
import com.example.springredditclone.model.Comment;
import com.example.springredditclone.model.NotificationEmail;
import com.example.springredditclone.model.Post;
import com.example.springredditclone.model.User;
import com.example.springredditclone.repository.CommentRepository;
import com.example.springredditclone.repository.PostRepository;
import com.example.springredditclone.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CommentService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final CommentMapper commentMapper;
    private final MailContentBuilder mailContentBuilder;
    private final MailService mailService;

    public void save(CommentDto commentDto) {

        Post post = postRepository.findById(commentDto.getPostId())
                .orElseThrow(() -> new SpringRedditException("Post not found with id: "+commentDto.getPostId()));

        User user = authService.getCurrentUser();
        Comment comment = commentMapper.map(commentDto, post, user);
        commentRepository.save(comment);
        String message = mailContentBuilder.build(user.getUsername()+" posted a comment on your post "+post.getPostName());
        sendCommentNotification(message, post.getUser(), user);

    }

    private void sendCommentNotification(String message, User postUser, User commentUser) {

        mailService.sendMail(new NotificationEmail(commentUser.getUsername()+" commented on your post",
                postUser.getEmail(),message));

    }


    public List<CommentDto> getAllCommentsForPost(Long postId) {

        Post post = postRepository.findById(postId).orElseThrow(() -> new SpringRedditException("Post Not found with given id: "+postId));
        return commentRepository.findByPost(post)
                .stream()
                .map(commentMapper::mapToDto)
                .collect(Collectors.toList());

    }

    public List<CommentDto> getCommentsByUsername(String username) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new SpringRedditException(username+"not found "));

        return commentRepository.findAllByUser(user)
                .stream()
                .map(commentMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
