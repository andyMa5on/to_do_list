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
		const modal = document.getElementById('modal')
		modal. innerHTML =`
			
		`

	}
}

class DeconstructModal {
	constructor(){}

	remove(){

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

	render(project, task) {
		const taskList = document.getElementById('tasks');
		const newtask = new CreateTask_Object(project, task)
		const taskElm = new CreateTask_Element(newtask)
		const liElm = taskElm.render();
		taskList.append(liElm)
	}
}



projectsMenu.addEventListener('click', openMenu);
addTask_Btn.addEventListener('click', AddTask.render)
