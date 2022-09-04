const projectsMenu = document.getElementById('menu_btn');
const addTask_Btn = document.getElementById('add_btn');
const addProject_Btn = document.getElementById('add_Project');
const menuClose_Btn = document.getElementById('menuClose_Btn');

let allTasks = [];

if (localStorage.key('allTasks') !== null) {
	allTasks = JSON.parse(localStorage.getItem('allTasks'));
}

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
				<button class="cancel_btn">Cancel</button>
				<button class="add_btn">Add Task</button>
			</div>
		`;

		const decon_Modal = new DeconstructModal();
		const cancelBtn = modal.querySelector('.cancel_btn');
		cancelBtn.addEventListener('click', decon_Modal.remove);

		const add_Task = new AddTask();
		const addBtn = modal.querySelector('.add_btn');
		addBtn.addEventListener('click', add_Task.render);

		const input = modal.querySelector('#taskTitle');
		input.addEventListener('keypress', (e) => {
			console.log(e)
			if (e.key === 'Enter') {
				add_Task.render();
			}
		});

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

		const input = modal.querySelector('#projectTitle');
		input.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				addProject.render();
			}
		});

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
		this.completed = 'no';
		allTasks.forEach((item, idx, allTasks) => {
			if (item.project === project) {
				item.tasks.push(this);
			}
		});
		Page.localStorage();
	}
}

class CreateTask_Element {
	constructor(taskObject) {
		this.taskItem = taskObject;
	}

	render() {
		const liElm = document.createElement('li');
		liElm.className = 'taskItem';
		liElm.draggable = 'true';
		liElm.id = `${this.taskItem.id}`;
		liElm.innerHTML = `
			<input type="checkbox" name="complete" id="complete">
			<input type="text" value="${this.taskItem.task}" editable />
			<div class="bin">
				<svg 
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="trashIcon"
					>
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
					</path>
					<line x1="10" y1="11" x2="10" y2="17"></line>
					<line x1="14" y1="11" x2="14" y2="17"></line>
				</svg>
			</div>
		`;

		liElm.addEventListener('dragstart', (event) => {
			event.dataTransfer.setData('taskitem', event.target.id);
			event.dataTransfer.effectAllowed = 'move';
			liElm.style.opacity = 0.5;
			Page.fakeDropElm('fakeTask','tasks', event.dataTransfer.types[0])
		});

		liElm.addEventListener('dragenter', (event) => {
			if (event.dataTransfer.types[0] === 'taskitem') {
				event.preventDefault();
				liElm.classList.add('over');
			}
		});

		liElm.addEventListener('dragover', (event) => {
			if (event.dataTransfer.types[0] === 'taskitem') {
				event.preventDefault();
				if (!event.currentTarget.classList.contains('over')) {
					event.currentTarget.classList.add('over');
				}
			}
		});

		liElm.addEventListener('dragleave', (event) => {
			if (event.dataTransfer.types[0] === 'taskitem') {
				event.preventDefault();
				liElm.classList.remove('over');
			}
		});

		liElm.addEventListener('dragend', (event) => {
			liElm.style.opacity = 1;
		});

		liElm.addEventListener('drop', (event) => {
			if (event.dataTransfer.types[0] === 'taskitem') {
				Page.drop(
					event.dataTransfer.getData('taskitem'),
					event,
					'taskItem',
					'tasks'
				);
			}
		});

		const checkbox = liElm.querySelector('input[type=checkbox]');
		checkbox.addEventListener('change', this.complete.bind(this, liElm));

		const deleteButton = liElm.querySelector('.bin');
		deleteButton.addEventListener('click', this.remove.bind(this, liElm));

		const input = liElm.querySelector('input[type=text]');
		input.addEventListener('change', this.update.bind(this, liElm));

		if (this.taskItem.completed == 'yes') {
			checkbox.checked = true;
			liElm.classList.toggle('taskCompleted');
			input.style.textDecoration = 'line-through';
		}
		return liElm;
	}

	complete(element) {
		const checkbox = element.querySelector('input[type=checkbox]');
		const input = element.querySelector('input[type=text]');
		if (checkbox.checked == true) {
			element.classList.toggle('taskCompleted'),
			input.style.textDecoration = 'line-through';

			allTasks.forEach((item, idx, allTasks) => {
				if(item.project == document.getElementById('project_Title').innerText){
					item.tasks.forEach((task, index, tasks) => {
						if (task.id == this.taskItem.id) {
							task.completed = 'yes';
						}
					});
				}
			});
			Page.localStorage();
		} else if (element.classList.contains('taskCompleted')) {
			element.classList.toggle('taskCompleted');
			input.style.textDecoration = 'none';

			allTasks.forEach((item, idx, allTasks) => {
				if(item.project == document.getElementById('project_Title').innerText){
					item.tasks.forEach((task, index, tasks) => {
						if (task.id == this.taskItem.id) {
							task.completed = 'no';
						}
					});
				}
			});
			Page.localStorage();
		}
	}

	update(element) {
		allTasks.forEach((item, idx, alltasks) => {
			item.tasks.forEach((taskItem, index, tasks) => {
				if (taskItem.id == this.taskItem.id) {
					const input = element.querySelector('input[type=text]');
					taskItem.task = input.value;
				}
			});
		});
		Page.localStorage();
	}

	remove(element) {
		const confirmDeletion = confirm(
			'Are you sure you wish to permanently delete this task?'
		);

		if (confirmDeletion == true) {
			const taskList = document.getElementById('tasks');
			taskList.removeChild(element);

			allTasks.forEach((item, idx, allTasks) => {
				if(item.project == document.getElementById('project_Title').innerText){
					item.tasks.forEach((task, position, tasks) => {
						if (task.id == this.taskItem.id) {
							allTasks[idx].tasks.splice(position, 1);
						}
					});
				}
			});
			Page.localStorage();
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
		this.id = Date.now();
		this.project = title;
		this.tasks = [];
		allTasks.push(this);
		Page.localStorage();
	}
}

class CreateProject_Element {
	constructor(projectTitle) {
		this.projectItem = projectTitle;
	}

	render() {
		const liElm = document.createElement('li');
		liElm.id = `${this.projectItem.id}`;
		liElm.draggable = 'true';
		liElm.className = 'projectItem';
		liElm.innerHTML = `
		<div>${this.projectItem.project}</div>
		<div class="bin">
				<svg 
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="trashIcon"
					>
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
					</path>
					<line x1="10" y1="11" x2="10" y2="17"></line>
					<line x1="14" y1="11" x2="14" y2="17"></line>
				</svg>
			</div>
		`;

		liElm.addEventListener('dragstart', (event) => {
			event.dataTransfer.setData('projectitem', event.target.id);
			event.dataTransfer.effectAllowed = 'move';
			liElm.style.opacity = 0.5;
			Page.fakeDropElm('fakeProject','menu', event.dataTransfer.types[0],)
		});

		liElm.addEventListener('dragenter', (event) => {
			if (event.dataTransfer.types[0] === 'projectitem') {
				event.preventDefault();
				liElm.classList.add('over');
			}
		});

		liElm.addEventListener('dragover', (event) => {
			if (event.dataTransfer.types[0] === 'projectitem') {
				event.preventDefault();
				if (!event.currentTarget.classList.contains('over')) {
					event.currentTarget.classList.add('over');
				}
			}
		});

		liElm.addEventListener('dragleave', (event) => {
			if (event.dataTransfer.types[0] === 'projectitem') {
				event.preventDefault();
				liElm.classList.remove('over');
			}
		});

		liElm.addEventListener('dragend', (event) => {
			liElm.style.opacity = 1;
		});

		liElm.addEventListener('drop', (event) => {
			if (event.dataTransfer.types[0] === 'projectitem') {
				Page.drop(
					event.dataTransfer.getData('projectitem'),
					event,
					'projectItem',
					'menu'
				);
			}
		});

		liElm.addEventListener('click', this.uiUpdate.bind(this));

		const removeBtn = liElm.querySelector('.bin');
		removeBtn.addEventListener('click', (event) => {
			this.remove.bind(this, liElm)();
			event.stopPropagation();
		});
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
			'Are you sure you wish to permanently delete this project?'
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
			Page.localStorage();
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
			if (item.project === projectTitle.value) {
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
				'A project of this name already exsists \n' +
					'Please create a unique name'
			);
			projectTitle.focus();
		}
	}
}

class Page {
	renderPage() {
		const taskArea = document.getElementById('tasks');

		if (allTasks.length > 0) {
			allTasks.forEach((item, idx, alltasks) => {
				const projectList = document.getElementById('menu');
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
		localStorage.setItem('allTasks', JSON.stringify(allTasks));
	}

	static drop(elementID, event, classID, removeFakeEl) {
		const elm = document.getElementById(elementID);

		let dropElm = document.elementFromPoint(event.clientX, event.clientY);
		console.log(dropElm)
		if(
			dropElm.classList.contains('fakeProject') ||
			dropElm.classList.contains('fakeTask')
		){
			console.log(dropElm)
		}else if (!dropElm.classList.contains(classID)) {
			dropElm = dropElm.parentElement;
		}

		dropElm.insertAdjacentElement('beforebegin', elm);

		document.getElementById(removeFakeEl).removeChild(document.getElementById('fake'))

		dropElm.classList.remove('over');
		elm.style.opacity = 1;

		if (event.dataTransfer.types[0] === 'taskitem') {
			const projectTitle =
				document.getElementById('project_Title').innerText;

			let taskIDX;
			let insertIDX;

			if (dropElm.id == 'fake'){
				allTasks.forEach((item, idx) => {
					if (item.project === projectTitle) {
						item.tasks.forEach((task, index) => {
							if (task.id == elm.id) {
								taskIDX = index;
							}
						});
					}
					const removeObject = allTasks[idx].tasks.splice(taskIDX, 1);
	
					allTasks[idx].tasks.push(removeObject[0])
				});
			}else{
				allTasks.forEach((item, idx) => {
					if (item.project === projectTitle) {
						item.tasks.forEach((task, index) => {
							if (task.id == elm.id) {
								taskIDX = index;
							}
	
							if (task.id == dropElm.id) {
								insertIDX = index;
							}
						});
					}
					const removeObject = allTasks[idx].tasks.splice(taskIDX, 1);
	
					if (insertIDX > taskIDX) {
						allTasks[idx].tasks.splice(insertIDX - 1, 0, removeObject[0]);
					} else {
						allTasks[idx].tasks.splice(insertIDX, 0, removeObject[0]);
					}
				});
			}	
		} else {
			const projectValue = elm.querySelector('div').innerText;
			

			let taskIDX;
			let insertIDX;

			if(dropElm.id == 'fake'){
				allTasks.forEach((item, idx) => {
					if (item.project === projectValue) {
						taskIDX = idx;
					}
				});
	
				const removeObject = allTasks.splice(taskIDX, 1);
				allTasks.push(removeObject[0])
			} else {
				const dropElm_Value = dropElm.querySelector('div').innerText;

				allTasks.forEach((item, idx) => {
					if (item.project === projectValue) {
						taskIDX = idx;
					}
	
					if (item.project === dropElm_Value) {
						insertIDX = idx;
					}
				});
	
				const removeObject = allTasks.splice(taskIDX, 1);
	
				if (insertIDX > taskIDX) {
					allTasks.splice(insertIDX - 1, 0, removeObject[0]);
				} else {
					allTasks.splice(insertIDX, 0, removeObject[0]);
				}
			}
			
		}

		Page.localStorage();
	}

	static fakeDropElm (classStyle, appendElm, eventType, ParentElm) {
		const fake = document.createElement('li')
		fake.id = 'fake'
		fake.className = classStyle
		fake.innerText = `drop item at bottom of list`
		const menu = document.getElementById(appendElm)
		menu.append(fake)

		fake.addEventListener('dragenter', (event) => {
			if (event.dataTransfer.types[0] === eventType) {
				event.preventDefault();
				fake.classList.add('over');
			}
		});

		fake.addEventListener('dragover', (event) => {
			if (event.dataTransfer.types[0] === eventType) {
				event.preventDefault();
				if (!event.currentTarget.classList.contains('over')) {
					event.currentTarget.classList.add('over');
				}
			}
		});

		fake.addEventListener('dragleave', (event) => {
			if (event.dataTransfer.types[0] === eventType) {
				event.preventDefault();
				fake.classList.remove('over');
			}
		});

		fake.addEventListener('drop', (event) => {
			if (event.dataTransfer.types[0] === eventType) {
				Page.drop(
					event.dataTransfer.getData(eventType),
					event,
					eventType,
					appendElm
				);
			}
		});

	}
}

const createModal = new CreateModal();

projectsMenu.addEventListener('click', openMenu);
menuClose_Btn.addEventListener('click', openMenu);
addProject_Btn.addEventListener('click', createModal.renderProject);
addTask_Btn.addEventListener('click', createModal.renderTask);

const renderPage = new Page();
renderPage.renderPage();
