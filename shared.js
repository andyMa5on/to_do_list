const projectsMenu = document.getElementById('menu_btn');
const addTask_Btn = document.getElementById('add_btn');
const addProject_Btn = document.getElementById('add_Project');
const menuClose_Btn = document.getElementById('menuClose_Btn');

let allTasks =[];

if(localStorage.key('allTasks') !== null) {
	allTasks = JSON.parse(localStorage.getItem('allTasks'));
};

function openMenu() {
	const app = document.getElementById('app');
	const menu = document.getElementById('menu');

	menu.classList.toggle('appear');
	app.classList.toggle('minimise');
}

class CreateModal {
	constructor() {}

	renderTask() {
		const modal = document.getElementById('modal');
		const backdrop = document.getElementById('backdrop');

		modal.innerHTML = `
			<div id="modal_Inputs">
				<input type="text" id="taskTitle">
			</div>
			<div id="modal_Btns">
				<button class="cancel_btn">cancel</button>
				<button class="add_btn">add</button>
			</div>
		`;

		const decon_Modal = new DeconstructModal();
		const cancelBtn = modal.querySelector('.cancel_btn');
		cancelBtn.addEventListener('click', decon_Modal.remove);

		const add_Task = new AddTask();
		const addBtn = modal.querySelector('.add_btn');
		addBtn.addEventListener('click', add_Task.render);

		backdrop.addEventListener('click', decon_Modal.remove);
		backdrop.classList.toggle('hidden');
		modal.classList.toggle('hidden');

		modal.querySelector('input').focus();
	}

	renderProject() {
		const modal = document.getElementById('modal');
		const backdrop = document.getElementById('backdrop');

		modal.innerHTML = `
			<div id="modal_Inputs">
				<input type="text" id="projectTitle">
			</div>
			<div id="modal_Btns">
				<button class="cancel_btn">cancel</button>
				<button class="add_btn">add</button>
			</div>
		`;

		const decon_Modal = new DeconstructModal();
		const cancelBtn = modal.querySelector('.cancel_btn');
		cancelBtn.addEventListener('click', decon_Modal.remove);

		const addProject = new AddProject();
		const addBtn = modal.querySelector('.add_btn');
		addBtn.addEventListener('click', addProject.render);

		backdrop.addEventListener('click', decon_Modal.remove);
		backdrop.classList.toggle('hidden');
		modal.classList.toggle('hidden');

		modal.querySelector('input').focus();
	}
}

class DeconstructModal {
	constructor() {}

	remove() {
		const modal = document.getElementById('modal');
		const backdrop = document.getElementById('backdrop');

		modal.classList.toggle('hidden');
		backdrop.classList.toggle('hidden');
	}
}

class CreateTask_Object {
	constructor(project, task) {
		this.id = Date.now();
		this.task = task;
		allTasks.forEach((item, idx, allTasks) => {
			if (item.project === project) {
				item.tasks.push(this);
			}
		});
		Page.localStorage()
	}
}

class CreateTask_Element {
	constructor(taskObject) {
		this.taskItem = taskObject;
	}

	render() {
		const liElm = document.createElement('li');
		liElm.className = 'taskItem';
		liElm.innerHTML = `
			<input type="text" value="${this.taskItem.task}" editable />
			<button>Delete</button>
		`;
		const deleteButton = liElm.querySelector('button');
		deleteButton.addEventListener('click', this.remove.bind(this, liElm));
		return liElm;
	}

	remove(element) {
		const confirmDeletion = confirm(
			'Are you sure you wish to delete this item?'
		);

		if (confirmDeletion == true) {
			const taskList = document.getElementById('tasks');
			taskList.removeChild(element);

			allTasks.forEach((item, idx, allTasks) => {
				item.tasks.forEach((task, position, tasks) => {
					if (task.id == this.taskItem.id) {
						allTasks[idx].tasks.splice(position, 1);
					}
				});
			});
			Page.localStorage()
		} else {
			return;
		}
	}
}

class AddTask {
	constructor() {}

	render() {
		const taskList = document.getElementById('tasks');
		const taskTitle = document.getElementById('taskTitle');
		const projectTitle = document.getElementById('project_Title');
		const newtask = new CreateTask_Object(
			projectTitle.innerText,
			taskTitle.value
		);
		const taskElm = new CreateTask_Element(newtask);
		const liElm = taskElm.render();
		taskList.append(liElm);
		const modal = document.getElementById('modal');
		const backdrop = document.getElementById('backdrop');
		taskTitle.value = '';
		modal.classList.toggle('hidden');
		backdrop.classList.toggle('hidden');
	}
}

class CreateProject_Object {
	constructor(title) {
		this.project = title;
		this.tasks = [];
		allTasks.push(this);
		Page.localStorage()
	}
}

class CreateProject_Element {
	constructor(projectTitle) {
		this.projectItem = projectTitle;
	}

	render() {
		const liElm = document.createElement('li');
		liElm.innerHTML = `
		<div>${this.projectItem.project}</div>
		<button>Delete</button>
		`;

		const divElm = liElm.querySelector('div');
		divElm.addEventListener('click', this.uiUpdate.bind(this));

		const removeBtn = liElm.querySelector('button');
		removeBtn.addEventListener('click', this.remove.bind(this, liElm));
		return liElm;
	}

	uiUpdate() {
		if (allTasks.length > 0) {
			const taskArea = document.getElementById('tasks');
			taskArea.innerHTML = `
				<h2>Project: <span id="project_Title"></span></h2>
			`;
			const title = document.getElementById('project_Title');
			title.innerText = this.projectItem.project;

			allTasks.forEach((item, idx, allTasks) => {
				if (item.project === this.projectItem.project) {
					item.tasks.forEach((task, idx, tasks) => {
						const taskList = document.getElementById('tasks');
						const taskElm = new CreateTask_Element(task);
						const liElm = taskElm.render();
						taskList.append(liElm);
					});
				}
			});
			const projectList = document.getElementById('menu');
			if (projectList.classList.contains('appear')) {
				openMenu();
			}
		} else {
			const taskArea = document.getElementById('tasks');
			taskArea.innerHTML = `
				<p class="noProjects">You currently have no Projects</p>
				<p class="noProjects">Lets get started by creating your first one now</P>
				<button>Create Now</button>
			`;

			const button = taskArea.querySelector('button');
			button.addEventListener('click', createModal.renderProject);
		}
	}

	remove(element) {
		const confirmDeletion = confirm(
			'Are you sure you wish to delete this project?'
		);

		if (confirmDeletion == true) {
			const project = document.getElementById('menu');
			project.removeChild(element);
			allTasks.forEach((item, idx, alltasks) => {
				if (item.project === this.projectItem.project) {
					allTasks.splice(idx, 1);
					const currentProject_title =
						document.getElementById('project_Title');
					if (
						currentProject_title.innerText ===
						this.projectItem.project
					) {
						if (allTasks.length >= 1) {
							const newUI = new CreateProject_Element(
								allTasks[0]
							);
							newUI.uiUpdate();
						} else {
							const newUI = new CreateProject_Element();
							newUI.uiUpdate();
						}
					}
				}
			});
			Page.localStorage()
		} else {
			return;
		}
	}
}

class AddProject {
	render() {
		let uniqueProject = true;
		const projectList = document.getElementById('menu');
		const projectTitle = document.getElementById('projectTitle');
		allTasks.forEach((item, idx, allTasks) => {
			if (item.project.includes(projectTitle.value)) {
				uniqueProject = false;
			}
		});
		if (uniqueProject === true) {
			const project_Object = new CreateProject_Object(projectTitle.value);
			const projectElm = new CreateProject_Element(project_Object);
			const liElm = projectElm.render();
			projectList.append(liElm);
			projectElm.uiUpdate();
			const modal = document.getElementById('modal');
			const backdrop = document.getElementById('backdrop');
			modal.classList.toggle('hidden');
			backdrop.classList.toggle('hidden');

			if (projectList.classList.contains('appear')) {
				openMenu();
			}
		} else {
			const warning = alert(
				'A project of this name already exsists \n'+
				'Please create a unique name'
			);
			projectTitle.focus()
		}
	}
}

class Page {
	renderPage() {
		const taskArea = document.getElementById('tasks');

		if (allTasks.length >= 1) {
			allTasks.forEach((item, idx, alltasks) => {
					const projectList = document.getElementById('menu');
					console.log(allTasks)
					const add_Project = new CreateProject_Element(item);
					const liElm = add_Project.render();
					projectList.append(liElm);
			});
			const newUI = new CreateProject_Element(allTasks[0]);
			newUI.uiUpdate();
		} else {
			taskArea.innerHTML = `
				<p class="noProjects">You currently have no Projects</p>
				<p class="noProjects">Lets get started by creating your first one now</P>
				<button>Create Now</button>
			`;

			const button = taskArea.querySelector('button');
			button.addEventListener('click', createModal.renderProject);
		}
	}

	static localStorage() {
		localStorage.setItem('allTasks', JSON.stringify(allTasks))
	}

	/* render_Projects(object) {
		const liElm = document.createElement('li');
		liElm.innerHTML = `
		<div>${object.project}</div>
		<button>Delete</button>
		`;

		const divElm = liElm.querySelector('li');
		liElm.addEventListener('click', this.uiUpdate.bind(this));

		const removeBtn = liElm.querySelector('button');
		removeBtn.addEventListener('click', this.remove.bind(this, liElm));
		return liElm;
	} */
}

const createModal = new CreateModal();

projectsMenu.addEventListener('click', openMenu);
menuClose_Btn.addEventListener('click', openMenu);
addProject_Btn.addEventListener('click', createModal.renderProject);
addTask_Btn.addEventListener('click', createModal.renderTask);

const renderPage = new Page();
renderPage.renderPage();