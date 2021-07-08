var db = [
    {
        name: "1-А",
        shedule: [
            [ "Математика", "Физ-ра", "Хуета", "Биология" ],
            [ "Русский язык", "Физ-ра", "Хуета", "Литература" ],
            [],
            [ "Математика", "Физ-ра", "Биология", "Труды", "БДСМ", "English" ],
            [],
            []
        ]
    }
];
var currentClass;
const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const fckngDays = ["Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"];
var x, y, draggableLessonIndex, draggableScheduleIndex, objY = null;

const openAddClassModal = () => {
    addClassModal.style.display = "flex";
    setTimeout(() => {
        addClassModal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        addClassModal.children[0].style.transform = "scale(1)";
    }, 0);
}

const closeAddClassModal = () => {
    addClassModal.children[0].style.transform = "scale(0)";
    addClassModal.style.backgroundColor = "rgba(0, 0, 0, 0)";
    setTimeout(() => {
        addClassModal.style.display = "none";
        addClassModal.querySelector("input").value = "";
    }, 300);
}

const openShedule = () => {
    classesContainer.classList.add("leftPositioned");
    sheduleContainer.classList.add("leftPositioned");
    setTimeout(() => {
        sheduleContainer.children[0].style.transform = "translateY(0)";
    }, 500);
    updateSheduleContainer();
}

const closeShedule = () => {
    classesContainer.classList.remove("leftPositioned");
    sheduleContainer.classList.remove("leftPositioned");
    sheduleContainer.children[0].style.transform = "translateY(-120px)";
    currentClass = null;
    setTimeout(() => sheduleContainer.children[1].scrollTo(0, 0), 500);
}

const createClassItem = (name, isLast, index) => {
    const obj = document.createElement("div");
    obj.innerText = name;
    obj.addEventListener("click", () => {
        if (isLast) {
            openAddClassModal();
        } else {
            sheduleContainer.querySelector("h2").innerText = name;
            currentClass = index;
            openShedule();
        }
    });
    return obj;
}

const createLessonItem = (name, lessonIndex, sheduleIndex) => {
    const obj = document.createElement("div");
    const span = document.createElement("span");
    const renameIcon = document.createElement("img");
    const deleteIcon = document.createElement("img");
    renameIcon.src = "src/edit_icon.svg";
    deleteIcon.src = "src/trash_icon.svg";
    renameIcon.draggable = false;
    deleteIcon.draggable = false;
    span.innerText = name;
    span.title = name;
    obj.append(span, renameIcon, deleteIcon);
    obj.className = "lessonItem";
    renameIcon.addEventListener("click", () => {
        const name = prompt("Введите новое название");
        if (!name || !name.trim()) return;
        span.title = span.innerText = db[currentClass].shedule[sheduleIndex][lessonIndex] = name.trim();
    });
    deleteIcon.addEventListener("click", () => {
        const answer = confirm(`Вы уверены, что хотите удалить урок "${db[currentClass].shedule[sheduleIndex][lessonIndex]}"?`);
        if (!answer) return;
        db[currentClass].shedule[sheduleIndex].splice(lessonIndex, 1);
        obj.style.opacity = 0;
        setTimeout(() => {
            sheduleContainer.children[1].children[sheduleIndex].children[1].replaceChildren(...db[currentClass].shedule[sheduleIndex].map((item, index) => createLessonItem(item, index, sheduleIndex)));
        }, 300);
    });
    obj.addEventListener("mousedown", e => {
        objY = obj.getBoundingClientRect().y;
        x = e.x;
        y = e.y;
        obj.style.transition = "none";
        draggableLessonIndex = lessonIndex;
        draggableScheduleIndex = sheduleIndex;
    });
    return obj;
}

const createSheduleItem = (arr, sheduleIndex) => {
    const obj = document.createElement("div");
    const h3 = document.createElement("h3");
    const header = document.createElement("div");
    const addIcon = document.createElement("img");
    const container = document.createElement("div");
    addIcon.src = "src/add_icon.svg";
    addIcon.addEventListener("click", () => {
        const name = prompt("Введите предмет");
        if (!name || !name.trim()) return;
        db[currentClass].shedule[sheduleIndex].push(name);
        container.append(createLessonItem(name, db[currentClass].shedule[sheduleIndex].length - 1, sheduleIndex));
    });
    h3.innerText = days[sheduleIndex];
    header.append(h3, addIcon);
    container.append(...arr.map((item, index) => createLessonItem(item, index, sheduleIndex)));
    obj.append(header, container);
    return obj;
}

const updateClassesContainer = () => {
    classesContainer.children[0].replaceChildren(...db.map((item, index) => createClassItem(item.name, false, index)), createClassItem("+", true));
}

const updateSheduleContainer = () => {
    const arr = db[currentClass].shedule.map(createSheduleItem);
    sheduleContainer.children[1].replaceChildren(...arr);
    for (let i = 0; i < arr.length; i++) {
        setTimeout(() => {
            arr[i].style.opacity = 1;
        }, i * 100 + 500);
    }
}

addEventListener("load", () => {

    setTimeout(() => {
        //authModal.style.top = "100px";
        //authModal.style.opacity = 1;
    }, 500);

    updateClassesContainer();

    addClassModal.children[0].addEventListener("click", e => e.stopPropagation());

    addClassModal.addEventListener("click", () => {
        closeAddClassModal();
    });

    addClassModal.querySelector("button").addEventListener("click", () => {
        const text = addClassModal.querySelector("input").value;
        if (text) db.push({
            name: text,
            shedule: [
                [], [], [], [], [], []
            ]
        });
        closeAddClassModal();
        updateClassesContainer();
    });

    closeSheduleButton.addEventListener("click", closeShedule);

    deleteClassButton.addEventListener("click", () => {
        const answer = confirm(`Вы уверены, что хотите удалить класс ${db[currentClass].name}?`);
        if (!answer) return;
        db.splice(currentClass, 1);
        updateClassesContainer();
        closeShedule();
    });

    renameClassButton.addEventListener("click", () => {
        const name = prompt("Введите новое название");
        if (!name || !name.trim()) return;
        sheduleContainer.querySelector("h2").innerText = db[currentClass].name = name.trim();
        updateClassesContainer();
    });

    addEventListener("mousemove", e => {
        if (objY == null) return;
        sheduleContainer.children[1].children[draggableScheduleIndex].children[1].children[draggableLessonIndex].style.transform = `translate(${e.x - x}px, ${e.y - y}px)`;
    });

    addEventListener("mouseup", e => {
        if (objY == null) return;
        const container = sheduleContainer.children[1].children[draggableScheduleIndex].children[1];
        const obj = container.children[draggableLessonIndex];
        obj.style.transition = "0.3s";
        for (let i = 0; i < container.children.length; i++) {
            if (i == draggableLessonIndex) continue;
            const data = container.children[i].getBoundingClientRect();
            if (!(e.x < data.x || e.x > data.x + data.width || e.y < data.y || e.y > data.y + data.height)) {
                obj.style.transform = `translate(0px, ${data.y - objY}px)`;
                container.children[i].style.transform = `translate(0px, ${objY - data.y}px)`;
                setTimeout(() => {
                    const temp = db[currentClass].shedule[draggableScheduleIndex][i];
                    db[currentClass].shedule[draggableScheduleIndex][i] = db[currentClass].shedule[draggableScheduleIndex][draggableLessonIndex];
                    db[currentClass].shedule[draggableScheduleIndex][draggableLessonIndex] = temp;
                    container.replaceChildren(...db[currentClass].shedule[draggableScheduleIndex].map((item, index) => createLessonItem(item, index, draggableScheduleIndex)));
                }, 300);
                objY = null;
                return;
            }
        }
        obj.style.transform = "none";
        objY = null;
    });
});
