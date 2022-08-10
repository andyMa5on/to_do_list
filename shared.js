const projectsMenu = document.getElementById('menu_btn');
const addTask_Btn = document.getElementById('add_btn');
const addProject_Btn = document.getElementById('add_Project');
const allTasks = [];

function openMenu() {
	const app = document.getElementById('app');
	const menu = document.getElementById('menu');
	const header = document.getElementById('header');

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

		backdrop.classList.toggle('hidden');
		modal.classList.toggle('hidden');
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

		backdrop.classList.toggle('hidden');
		modal.classList.toggle('hidden');
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
		this.project = project;
		this.task = task;
		allTasks.push(this);
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
		console.log(this.taskItem);
		console.log(element);

		const confirmDeletion = confirm(
			'Are you sure you wish to delete this item?'
		);

		if (confirmDeletion == true) {
			const taskList = document.getElementById('tasks');
			taskList.removeChild(element);
		} else {
			return;
		}
	}
}

class AddTask {
	constructor() {}

	render(project) {
		const taskList = document.getElementById('tasks');
		const taskTitle = document.getElementById('taskTitle');
		const newtask = new CreateTask_Object(project, taskTitle.value);
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

class CreateProject_Element {
	constructor(projectTitle) {
		this.projectItem = projectTitle;
	}

	render() {
		const liElm = document.createElement('li');
		liElm.innerHTML = `
		<div>${this.projectItem}</div>
		<button>Delete</button>
		`;

		const divElm = liElm.querySelector('div')
		divElm.addEventListener('click', this.uiUpdate.bind(this))

		const removeBtn = liElm.querySelector('button')
		removeBtn.addEventListener('click', this.remove.bind(this, liElm))
		return liElm;
	}

	uiUpdate() {
		const title = document.getElementById('project_Title');
		title.innerText = this.projectItem;
		

	}

	remove(element) {
		console.log(element)

		const confirmDeletion = confirm(
			'Are you sure you wish to delete this project?'
		);

		if (confirmDeletion == true) {
			const project = document.getElementById('menu');
			project.removeChild(element);
		} else {
			return;
		}
	}
}

class AddProject {
	render() {
		const projectList = document.getElementById('menu');
		const projectTitle = document.getElementById('projectTitle');
		const projectElm = new CreateProject_Element(projectTitle.value);
		const liElm = projectElm.render();
		projectList.append(liElm)
		const modal = document.getElementById('modal');
		const backdrop = document.getElementById('backdrop');
		projectTitle.value = '';
		modal.classList.toggle('hidden');
		backdrop.classList.toggle('hidden');
	}
}

const createModal = new CreateModal();

projectsMenu.addEventListener('click', openMenu);
addProject_Btn.addEventListener('click', createModal.renderProject);
addTask_Btn.addEventListener('click', createModal.renderTask);
