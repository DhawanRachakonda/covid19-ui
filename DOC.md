<h2>Welcome To Rect Dev Camp 2020 🎉 😄</h2>

## Dev Containers in VScode

<ul>
<li>Adding themes</li>
<li>Configuring Project Settings</li>
<li>Adding ports</li>
<li>Specifying Environment</li>
<li>Installing prerequisites(eslint prettier react scripts typescript)</li>
<li>postCreateCommand</li>
<li>React Code Snippets</li>
</ul>

## Git Repo and Branches

<p>Branch master conatins all prerequisites</p>
<p>Branch <code>feature/react-redux</code> contains entire solution for this camp</p>

## Docker

<ul>
<li>Purpose Of Docker</li>
<li>Few things about docker(cgroups, images)</li>
<li>Commands We Use</li>
</ul>

## Restrictions

<ul>
<li>Husky</li>
<li>Commit message types</li>
<li>Commit messages</li>
<li>Linting before you commit</li>
</ul>

## React ⚛️

### Introduction

<ul>
<li>Bundle size difference between react and angular </li>
<li>Lifecycle methods</li>
<li>How hooks changed</li>
</ul>

### Hooks 📌

<ul>
<li>useState</li>
<li>useSelector</li>
<li>useHistory</li>
<li>useContext</li>
<li>useCallback</li>
</ul>

### Redux

<ul>
<li>Configuration</li>
<li>Typescript for Redux</li>
<li>When to use redux 🙄</li>
</ul>

### React Intl

<ul>
<li><a href="https://www.npmjs.com/package/react-intl">react-intl</a></li>
</ul>

## CRA [link](https://create-react-app.dev/docs/getting-started/")

<ul>
<li><a href="https://create-react-app.dev/docs/proxying-api-requests-in-development">Proxying requests</a></li>
<li><a href="https://create-react-app.dev/docs/title-and-meta-tags">Adding meta data information</a></li>
<li><a href="https://create-react-app.dev/docs/advanced-configuration">Removing source maps</a></li>
<li>Testing framework</li>
<li>Enzyme vs React testing library 👊</li>
</ul>

## React testing library 🐐

<ul>
<li>Asyn Utils</li>
<li>getByTestId, getByText, getByRole, getAllByText</li>
<li>findByText, findByRole, findAllByText, findAllByRole</li>
<li>Generating Snapshots</li>
<li>queryByText</li>
<li>Advantahes of using data-test-id</li>
</ul>

## Jest

<ul>
<li>Mocking</li>
<li>Debuging</li>
</ul>

## Production Build

<ul>
<li>Docker file</li>
<li>Nginx</li>
<li>Overing default conf</li>
<li>Enable GZip</li>
<li>Brotli</li>
</ul>

## Dev Containers in VScode

### Adding themes

<article>
<p>
Maintaining same accross team is very usefull for quick development, solving issues. You can add them just by visiting masket place, and copy its is and reffer in devcontainer.json.
</p>
<p>
You cas also add like widget, in our case couple of examples could be adding react snippets, emojis while adding a commit, eslint, prettier etc...
</p>
</article>

### Configuring Project Settings

<article>
<p>
<code>

{
"settings": {

    "workbench.colorTheme": "Night Owl",
    "terminal.integrated.shell.linux": "/bin/zsh",

    "editor.tabSize": 2,
    "editor.formatOnSave": true,
    "prettier.requireConfig": true,
    "eslint.enable": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"

}
}

</code>

</p>
</article>

### Adding Ports

<article>
<p>
<code>
  "appPort": [3000, 3003],
</code>
</p>
<p>
This tells that allow incomming traffic on all these ports.
</p>
</article>

### Specifying Environment

<article>
<p>
  <code>
  "runArgs": ["-u", "node", "--env-file", "./devcontainer.env"],
  </code>
</p>
</article>

### Installing prerequisites

<article>
  <p>
    <div>This lets vscode install things for your entire container. Docker file inside .devcontainer</div>
    <code>
      RUN apt-get install -y zsh<br/>
      RUN npm install --global eslint prettier react-scripts
    </code>
  </p>
</article>

### postCreateCommand

<article>
  <p>
    <div>Says like once your dev container is installed, what should I do now?😕</div>
    <div>Snippet from devcontainer.json</div>
    <code>
      "postCreateCommand": "export ZSH_THEME=powerlevel9k/powerlevel9k && npm install && cd express-server && npm install",
    </code>
  </p>
</article>

### React Code Snippets

<article>
  <p>
    <div>Helps you to create lot of boiler plate code. Few of them are like creating class based, function based components, with prop validations, creating life cycle methods.</div>
<table>
<tr>      
<td>Trigger</td>	<td>Content<td>
</tr>
<tr>
<td>rcc→</td>	<td>class component skeleton</td>
</tr>
<tr>
<td>rccp→</td><td>class component skeleton with prop types after the class</td>
</tr>
<tr>
<td>rcjc→</td><td>class component skeleton without import and default export lines</td>
</tr>
<tr>
<td>rcfc→</td><td>class component skeleton that contains all the lifecycle methods</td>
</tr>
<tr>
<td>rsc→</td><td>stateless component skeleton</td>
</tr>
<tr>
<td>rscp→</td><td>stateless component with prop types skeleton</td>
</tr>
<tr>
<td>rpt→</td><td>empty propTypes declaration</td>
</tr>
<tr>
<td>con→</td><td>class default constructor with props</td></tr>
<tr><td>
conc→</td><td>class default constructor with props and context</td></tr>
<tr><td>
est→</td><td>empty state object</td></tr>
<tr><td>
cwm→</td><td>componentWillMount method</td></tr>
<tr>
<td>cdm→</td><td>componentDidMount method</td></tr>
<tr><td>
cwr→</td><td>componentWillReceiveProps method</td></tr>
<tr>
<td>scu→</td><td>shouldComponentUpdate method</td></tr>
<tr>
<td>cwup→</td><td>componentWillUpdate method</td></tr>
<tr><td>cdup→</td><td>componentDidUpdate method</td></tr>
<tr>
<td>cwun→</td><td>componentWillUnmount method</td></tr>
<tr>
<td>ren→</td><td>render method</td></tr>
<tr>
<td>sst→</td><td>this.setState with object as parameter</td></tr>
<tr><td>ssf→</td><td>this.setState with function as parameter</td></tr></table>
    </code>
  </p>
</article>

## Docker

### Purpose Of Docker

<article>
  <p>The purpose of docker here is to create a image for dev environment and intigrate it with vscode. We also use docker for generating production ready image. We use nginx and web server for our react application.</p>
</article>

### Few things about docker(cgroups, images)

<article>
  <p>cgroups are used to restrict resources for images. It makes sure that system doesn't get hanged</p>
</article>

### Commands We Use

<article>
  <p>
    <div>
      For Building an image
    </div>
    <code>sudo docker build -t react-dev-camp .</code><br/>
    <div>For running the image</div>
    <code>sudo docker run --init --rm -d -p 80:80 react-dev-camp</code><br/>
    <div>Kill image process</div>
    <code>docker ps %container_id%</code>
  </p>
</article>

## Restrictions

### Husky

<article>
  <p>Used for integrating with git hooks. You can certainly avail few things like things to do postPush, postCommit, staged</p>
</article>

### Commit message types

Refer <code>.commitlintrc.js</code>

### Commit messages

Refer <code>.commitlintrc.js</code>

### Linting before you commit

Refer <code>.lintstagedrc</code>

## React ⚛️

### Angular VS React

<code>C:\poc\WebComponents\Getting-Started-with-Web-Components\Chapter08\Angular\my-app</code>
<code>npm start</code>
<code>C:\poc\WebComponents\Getting-Started-with-Web-Components\Chapter08\React\my-app</code>
<code>npm start</code>

### Life Cycle Methods

<article>
  <p>
    <div>Creation</div>
    <code>
      constructor()
      getDerivedStateFromProps(p, s)
      render()
      componentDidMount()
    </code>
  </p>
  <p>
    <div>Updation</div>
    <code>
      getDerivedStateFromProps()
      shouldComponentUpdate()
      render()
      getSnapshotBeforeUpdate()
      componentDidUpdate(p, s)
    </code>
  </p>
</article>

### How hooks changed

<article>
  <p>
    <div>Class Based Component</div>
    <div>

      class UsersContainer extends React.PureComponent {
        async componentDidMount() {
          const response = await get(`/users`);
          this.setState({ users: response.data });
        };

        async componentDidUpdate(prevProps) {
          if (prevProps.resource !== this.props.resource) {
            const response = await get(`/users`);
            this.setState({ users: response.data });
          }
        };

        render() {
          return (...)
        }

      }

    </div>

  </p>
  <p>
    <div>Using Hooks</div>
    <div>

      const UsersContainer: React.FC = () => {
        const [ users, setUsers ] = useState([]);
        const [ showDetails, setShowDetails ] = useState(false);

        const fetchUsers = async () => {
          const response = await get('/users');
          setUsers(response.data);
        };

        useEffect( () => {
            fetchUsers(users)
          }, [ users ]
        );

        return (....)
      }

    </div>

  </p>
</arcticle>

## Hooks

<article><p>Refer RegistrationComponent.tsx, Template.tsx, ViewDoc.tsx</p></article>

## Redux

<article>
<p>Configuration, Typescript for Redux - Refer code</p>
<p>When to use redux 🙄</p>
</article>
