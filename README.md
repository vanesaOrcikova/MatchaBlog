🍵 Matcha Blog – Web SPA Application

As part of this project, I developed a blog-style web application with a matcha tea theme. The goal was to create a modern and clean website while implementing features that are commonly used in real-world web applications, such as dynamic data loading, article management, comments, authentication, and interactive forms.
The application is designed as a SPA (Single Page Application), meaning the content is updated dynamically without reloading the entire page.
 
🔄 SPA Routing & Navigation

    •   I implemented a main navigation menu that allows users to switch between different sections of the website.
    •   Page switching is handled using a custom hash-based router (e.g., #/articles, #/article/id).
    •   The router reacts to URL changes and dynamically loads the correct content without refreshing the page.
  
This approach makes the website behave like a real web application rather than a static site.

📰 Loading Articles from a School Database

Articles are not stored statically inside the project but are loaded dynamically from a school database through a server.
    • I implemented dynamic article loading using AJAX communication.
    • Articles are fetched using HTTP requests (GET) and transferred in JSON format.
    •	The data is then rendered into the article list view.

📌 Article List + Preview System

    •	I created an article list screen where all posts are displayed in a structured layout.
    •	Each article preview includes: title, author, image, short description / preview text

This allows users to quickly browse and select content.

🔍 Article Detail View + Content Management

After clicking on an article, a detailed view is displayed with full content.

    •	the detail page shows the full article text, image, and author information
    •	the detail view includes action buttons:
          o	Back – return to article list
          o	Edit – edit the selected article
          o	Delete – delete the article
          
This makes the website function not only as a blog but also as a simple CMS-style article management system.

✍️ Operations 

    •	GET – load articles from the server
    •	POST – add a new article through a form
    •	PUT – edit an existing article through an edit view
    •	DELETE – delete an article from the database

Server communication is handled using AJAX (XMLHttpRequest) and the data is processed in JSON format.

💬 Comments System

I implemented a comment section inside the article detail view to make the website more interactive.

    •	comments are loaded dynamically from the server
    •	comments are displayed as a list under the article
    •	users can submit new comments through a form
    •	after submission, the comment is stored and immediately displayed on the page

⭐ Opinions Section (Visitor Reviews)

In addition to comments, I implemented a separate Opinions section, functioning as a guest book or review system.

Users can submit an opinion using a form that includes: name, email, image URL, rating, newsletter subscription checkbox, opinion text field.

🔐 Authentication (Google Login)

I implemented user authentication using Google login.

    •	users can log in using their Google account
    •	after login, the user’s name is displayed on the website
    •	the username is automatically pre-filled in forms (e.g., when adding comments or creating articles)
    •	this reduces repetitive input and makes the system feel more realistic and personalized


🧩 Mustache Templates (Dynamic Rendering)

For content rendering, I used Mustache.js templates.

    •	templates contain predefined HTML structure
    •	dynamic data from the server (article title, author, image, comments, etc.) is automatically injected into the template
    •	this approach keeps the JavaScript code cleaner and avoids manually building HTML strings

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/d9c49cd7-d57f-4e1d-89e8-bacb7370bc72" />

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/2341aa9e-8c7e-4077-b06d-acc0fc905906" />
<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/8e3e7555-63b2-46de-a56f-f8b63b4967a9" />
<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/e2b2a0e0-bc75-43f0-a651-e6b84c7e7117" />


<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/bd4f5742-9efe-49fc-b7b7-8960c5617312" />
<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/78c5e721-2de0-4d61-8863-94ab5853146f" />

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/72a97b8c-cfc6-4154-823b-82cb98db341f" />

<img width="453" height="151" alt="image" src="https://github.com/user-attachments/assets/ba3ac6a1-51db-4671-9023-7f17120dca9d" />
<img width="545" height="556" alt="image" src="https://github.com/user-attachments/assets/8a2cccac-8fae-4841-9030-4636118d3768" />

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/daa57f23-819f-41b2-a93d-a1138d4cd0f6" />
<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/cef4b22f-42c6-4945-a4b4-b4eec488e0e1" />

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/cb982dd9-7ca3-49cf-b59f-5218ed93e1d6" />
<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/a637eb08-002f-4465-b472-9b45cacd0950" />













