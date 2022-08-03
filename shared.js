const projectsMenu = document.getElementById('menu_btn');
const addTask_Btn = document.getElementById('add_btn')
const allTasks = [];

function openMenu() {
	const app = document.getElementById('app');
	const menu = document.getElementById('menu');
	const header = document.getElementById('header');

	menu.classList.toggle('appear');
	app.classList.toggle('minimise');
}

class CreateTaskModal {
	constructor(){}

	render(){
		const modal = document.getElementById('modal');
		const backdrop = document.getElementById('backdrop');

		modal. innerHTML =`
			<div id="modal_Inputs">
				<input type="text" id="taskTitle" name="task">
			</div>
			<div id="modal_Btns">
				<button class="cancel_btn">cancel</button>
				<button class="add_btn">add</button>
			</div>
		`

		const decon_Modal = new DeconstructModal
		const cancelBtn = modal.querySelector('.cancel_btn')
		cancelBtn.addEventListener('click', decon_Modal.remove)

		const add_Task = new AddTask
		const addBtn = modal.querySelector('.add_btn')
		addBtn.addEventListener('click', () => {
			add_Task.render()
		})


		backdrop.classList.toggle('hidden');
		modal.classList.toggle('hidden');

	}
}

class DeconstructModal {
	constructor(){}

	remove(){
		const modal = document.getElementById('modal');
		const backdrop = document.getElementById('backdrop');

		modal.classList.toggle('hidden');
		backdrop.classList.toggle('hidden')
	}
}

class CreateTask_Object {
	constructor(project, task) { 
		this.project = project;
		this.task = task;
	}
}

class CreateTask_Element{
	constructor(taskObject){
		this.taskItem = taskObject
	}

	render(){
		const liElm = document.createElement('li');
		liElm.className = 'taskItem'
		liElm.innerHTML =`
			<input type="text" value="${this.taskItem.task}" editable />
			<button>Delete</button>
		`
		const deleteButton = liElm.querySelector('button')
		deleteButton.addEventListener('click', this.remove.bind(this, parent))
		return liElm;
	}

	remove(taskObject, parent){
		console.log(taskObject);
		console.log(parent);
	}
}

class AddTask {
    constructor(){}

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

const createModal = new CreateTaskModal

projectsMenu.addEventListener('click', openMenu);
addTask_Btn.addEventListener('click', createModal.render)
