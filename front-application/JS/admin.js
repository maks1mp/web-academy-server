let adminHidden=document.querySelector('#admin-hidden');
let adminDropDown=document.querySelector('.admin-dropdown-menu');
let adminDivMain=document.querySelectorAll('.admin-main-div>div');
let adminSidebarButton=document.querySelectorAll('.admin-sidebar button');
let adminSidebarButtonActive=document.querySelector('.admin-sidebar .adminOnSale');
let adminSidebarButtonSold=document.querySelector('.admin-sidebar .adminSold');
let adminSidebarButtonUsers=document.querySelector('.admin-sidebar .adminUsers');
let adminSidebarButtonAdd=document.querySelector('.admin-sidebar .adminAdd');
let adminTableActivePets1=document.querySelector('.admin-div-active');
let adminTableSoldPets1=document.querySelector('.admin-div-sold');
let adminTableUsers1=document.querySelector('.admin-div-users');
let adminTableAdd1=document.querySelector('.admin-add');
let adminHiddenLi=document.querySelectorAll('.admin-dropdown-menu li');
let adminTableActivePets=document.querySelector('.admin-div-active table tbody');
let adminTableSoldPets=document.querySelector('.admin-div-sold table tbody');
let adminTableUsers=document.querySelector('.admin-div-users table tbody');
let adminAddNewPetButton=document.querySelector('.admin-addbutton');
let adminAddNewPets=document.querySelectorAll('.admin-AddNewPet input');

let adminbuttons=['<button class="admin-edit edit"><i class="fas fa-pencil-alt"></i></button>','<button class="admin-delete"><i class="fas fa-trash"></i></button>','<button class="admin-sold"><i class="fas fa-hand-holding-usd"></i></button>'];

function showThisAndHideSiblings(el) {
    document.querySelectorAll('.admin-main-div div').forEach(item => adminremoveClass(item, 'admin-visible'));
    adminaddClass(el, 'admin-visible');
}

function colorSidebar (el) {
    adminSidebarButton.forEach((elem)=>{
        elem.style.color="grey";
    });
    el.style.color="rgb(215, 42, 195)";
}

adminSidebarButtonActive.addEventListener('click',()=>{    
    adminTableActivePets1.querySelector('tbody').innerHTML = '';
    showThisAndHideSiblings(adminTableActivePets1);
    colorSidebar(adminSidebarButtonActive);
    petsFactory.adminGetAllPets();
});

adminSidebarButtonSold.addEventListener('click',()=>{    
    showThisAndHideSiblings(adminTableSoldPets1);
    colorSidebar(adminSidebarButtonSold);
                
});

adminSidebarButtonUsers.addEventListener('click',()=>{    
    showThisAndHideSiblings(adminTableUsers1);
    colorSidebar(adminSidebarButtonUsers);
                
});

adminSidebarButtonAdd.addEventListener('click',()=>{    
    showThisAndHideSiblings(adminTableAdd1);
    colorSidebar(adminSidebarButtonAdd);
               
});

class NewPetorUser {
    admincreatePet(pet){
        requests.animals.add(pet,{
            success(result) {
                adminTableActivePets1.querySelector('tbody').innerHTML = '';
                showThisAndHideSiblings(adminTableActivePets1);
                colorSidebar(adminSidebarButtonActive);
                petsFactory.adminGetAllPets();
            }
        })
    } 
    adminGetAllPets() {
        requests.animals.getAll({
            success(result) {
                 if (result.status === 'ok') {
                    result.response.forEach(pet => {
                        console.log(pet);
                        let tr = document.createElement('tr');
                        for(let prop in pet){
                            var td = document.createElement('td');
                            td.innerHTML=pet[prop];
                            tr.appendChild(td);
                        }
                        for(let i=0;i<adminbuttons.length;i++){
                            var td = document.createElement('td');
                            td.innerHTML=adminbuttons[i];
                            tr.appendChild(td);
                        }

                        tr.setAttribute('data-id', pet._id);

                        adminTableActivePets.appendChild(tr);
                    })

                }
            },
            error(e) {console.log(e)}
})
    } 
    /* admincreateUser(){
        let tr = document.createElement('tr');
        for(let i=0;i<6;i++){
            var td = document.createElement('td');
            td.innerHTML=this.a[i];
            tr.appendChild(td);
        }
        for(let i=0;i<2;i++){
            var td = document.createElement('td');
            td.innerHTML=this.b[i];
            tr.appendChild(td);
        }
        adminTableUsers.appendChild(tr);
    } */
}

let petsFactory= new NewPetorUser();

// let adminInfo2=['Misha','Vaskiv','m.vas@mail.com','vasia','+380984444444','2018-01-01'];
// let adminbuttons2=['<button class="admin-edit edit"><i class="fas fa-pencil-alt"></i></button>','<button class="admin-delete"><i class="fas fa-trash"></i></button>'];
// let adminuser1=new NewPetorUser(adminInfo2,adminbuttons2);
//adminuser1.admincreateUser();


let adminaddClass = (elem,name)=>{
elem.classList.add(name);
};

let adminremoveClass=(elem,name)=>{
    elem.classList.remove(name);
};

adminHidden.addEventListener('mouseover',fun=()=>{
    adminaddClass(adminDropDown,'admin-dropdown-menu-visible');
});

adminDropDown.addEventListener('click',()=>{
    adminremoveClass(adminDropDown,'admin-dropdown-menu-visible');
});

adminDropDown.addEventListener('mouseout',()=>{
    adminremoveClass(adminDropDown,'admin-dropdown-menu-visible');
});

let adminAddNewPet =(a)=>{
    let adminpet2=new NewPetorUser(a,adminbuttons);
    adminpet2.admincreatePet();
};

let admincreateObj =(formFields)=>{
    let o={};         
    for(let i=0;i<formFields.length;i++){
        const name = formFields[i].getAttribute('name');
        o[name] = formFields[i].value;         
    }
    o.addedBy = 'test@test.com';
    return o;    
}; 

adminAddNewPetButton.addEventListener('click',()=>{
    let a=admincreateObj(adminAddNewPets);
    let validationResult = true;
    for(let i in a){
        if (a[i]==='') {
            validationResult = false;
            break;
        }
    }
    if (validationResult) {
        petsFactory.admincreatePet(a,adminbuttons);
        adminaddClass(adminTableActivePets.parentElement.parentElement,'admin-visible');
        adminremoveClass(adminAddNewPetButton.parentElement.parentElement.parentElement,'admin-visible');
        adminSidebarButton.forEach((elem)=>{
            if(elem.classList.contains('adminOnSale')){
                elem.style.color="rgb(215, 42, 195)";
            }
            else {
                elem.style.color="grey";
            }
        });
    } else {
        alert('Required fields should not be empty!');
    }
  
});

let adminButtonsDelete=document.querySelectorAll('.admin-delete');
let adminButtonsSold=document.querySelectorAll('.admin-sold');
let adminButtonsEdit=document.querySelectorAll('.admin-edit');

let adminDeleteFunction=(e)=>{    
    if (e.target.classList.contains('fa-trash')) {
        const id = e.target.closest('tr').getAttribute('data-id');

        console.log(id);

        requests.animals.delete(id, {
            success(res) {
                if (res.status === 'ok') {
                    adminTableActivePets1.querySelector('tbody').innerHTML = '';
                    showThisAndHideSiblings(adminTableActivePets1);
                    colorSidebar(adminSidebarButtonActive);
                    petsFactory.adminGetAllPets();
                }
            }
        })
    }
}

adminTableActivePets.addEventListener('click', adminDeleteFunction);
adminTableUsers.addEventListener('click', adminDeleteFunction);
adminTableSoldPets.addEventListener('click', adminDeleteFunction);

let adminRemoveChild=(a,b)=>{
    let adminbuttonin = event.target.closest('.admin-sold');
    let adminremoved=a.removeChild(adminbuttonin.parentElement.parentElement);
    b.appendChild(adminremoved); 
}

let adminSoldFunction=()=>{
    if(event.target.className==='admin-sold'||event.target.parentElement.className==='admin-sold') {
       let adminparent=event.target.parentElement.parentElement.parentElement.parentElement;
     if (adminparent===adminTableActivePets){
         adminRemoveChild(adminTableActivePets,adminTableSoldPets);    
     }
     else if (adminparent===adminTableSoldPets){
         adminRemoveChild(adminTableSoldPets,adminTableActivePets);      
     }}}

adminTableActivePets.addEventListener('click', adminSoldFunction);
adminTableUsers.addEventListener('click', adminSoldFunction);
adminTableSoldPets.addEventListener('click', adminSoldFunction);

let adminEditFunction=()=>{
    if(event.target.parentElement.classList.contains('admin-edit')) {
        let a=event.target.parentElement;
        if (a.classList.contains('edit')) {
            adminremoveClass(a,'edit');
            adminaddClass(a,'save');
            let b=a.parentElement.parentElement;
            let c=b.children;
            a.innerHTML='<i class="far fa-save"></i>';
            for (i=0;i<6;i++){
                c[i].innerHTML='<input class="admininput" type="text" value="'+c[i].innerHTML+'">';            
        }}
        else if (a.classList.contains('save')) {
            adminremoveClass(a,'save');
            adminaddClass(a,'edit');
            a.innerHTML='<i class="fas fa-pencil-alt"></i>';
            let b=a.parentElement.parentElement.querySelectorAll('input');
            for (i=0;i<b.length;i++){
                b[i].parentElement.innerHTML=b[i].value; 
        }}}};

adminTableActivePets.addEventListener('click', adminEditFunction);
adminTableUsers.addEventListener('click', adminEditFunction);
adminTableSoldPets.addEventListener('click', adminEditFunction);


