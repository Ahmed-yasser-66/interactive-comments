const root = document.querySelector('.root');
const replyBtn = document.querySelector('.reply');
const AddReplyComment = document.querySelector('.AddComment.reply-cmnt');
const comment = document.querySelector('.comment');

let commentsCount;

function displayComments() {
  fetch('./data.json')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.comments.forEach((comment) => {
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment-container');

        const commentID = comment.id;

        const commentDiv = createCommentDiv(comment);
        commentContainer.appendChild(commentDiv);
        console.log(commentDiv);

        comment.replies.forEach((reply) => {
          const replyID = reply.id;

          const replyDiv = createCommentDiv(reply, true);
          commentContainer.appendChild(replyDiv);
          console.log(replyDiv);
        });

        root.appendChild(commentContainer);
      });
    });
}

function createCommentDiv(comment, isReply = false) {
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');

  if (isReply) {
    commentDiv.classList.add('reply-msg');
  }

  const replyMsgSpan = isReply
    ? `<span class="replying-to">@${comment.replyingTo}</span>`
    : '';

  commentDiv.innerHTML = `
    <div class="comment__info">
      <img
        src="${comment.user.image.png}"
        alt="${comment.user.username}"
      />
      <p class="comment__info__name">${comment.user.username}</p>
      <p class="comment__info__time">${comment.createdAt}</p>
    </div>
    <div class="comment__content">
      <p>
        ${replyMsgSpan}
        ${comment.content}
      </p>
    </div>
    <div class="comment__vote-reply">
      <div class="vote">
        <div class="plus-container">
          <img class="plus" src="./images/icon-plus.svg" alt="plus" />
        </div>
        <p>${comment.score}</p>
        <div class="minus-container">
          <img class="minus" src="./images/icon-minus.svg" alt="minus" />
        </div>
      </div>
      <div class="reply">
        <img src="./images/icon-reply.svg" alt="reply" class="reply__img" />
        <p class="reply__p">Reply</p>
      </div>
    </div>
  `;

  return commentDiv;
}

function createReplyBox() {
  const replyBox = document.createElement('div');
  replyBox.classList.add('AddComment', 'reply-cmnt');

  replyBox.innerHTML = `
  <textarea
  class="AddComment__input"
  placeholder="Add a comment..."
></textarea>
<button class="AddComment__btn">REPLY</button>
<img
  src="./images/avatars/image-juliusomo.png"
  alt="image-juliusomo"
  class="AddComment__img"
/>
  `;

  return replyBox;
}

// Event Listeners

//Show reply box
root.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('reply') ||
    e.target.classList.contains('reply__img') ||
    e.target.classList.contains('reply__p')
  ) {
    const parentComment = e.target.closest('.comment');
    const existingReplyBox = parentComment.nextElementSibling;

    // Check if a reply box already exists
    if (existingReplyBox && existingReplyBox.classList.contains('AddComment')) {
      console.log('remove');
      existingReplyBox.remove();
    } else {
      console.log('add');
      const replyBox = createReplyBox();
      parentComment.insertAdjacentElement('afterend', replyBox);
    }
  }
});

//Send reply
root.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('AddComment__btn') &&
    e.target.innerHTML === 'REPLY'
  ) {
    fetch('./data.json')
      .then((res) => res.json())
      .then((data) => {
        const parentComment = e.target.parentNode.parentNode.firstChild;
        console.log(parentComment);

        const replyedPerson =
          parentComment.querySelector('.comment__info').children[1].textContent;
        console.log(replyedPerson);

        const replyContent =
          parentComment.nextElementSibling.querySelector(
            '.AddComment__input'
          ).value;
        console.log(replyContent);

        let commentsCount = data.comments.length;
        data.comments.forEach((comment) => {
          commentsCount += comment.replies.length;
        });
        console.log(commentsCount);

        const reblyObj = {
          id: commentsCount + 1,
          content: `${replyContent}`,
          createdAt: 'Just Now',
          score: 0,
          replyingTo: `${replyedPerson}`,
          user: {
            image: {
              png: `${data.currentUser.image.png}`,
              webp: `${data.currentUser.image.webp}`,
            },
            username: `${data.currentUser.username}`,
          },
        };

        console.log(reblyObj);
        commentsCount += 1;
      });
  }
});

displayComments();
