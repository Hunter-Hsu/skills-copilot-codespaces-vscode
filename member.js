function skillsMember(){
    var skill = document.getElementById('skill').value;
    var skillList = document.getElementById('skillList');
    var skillItem = document.createElement('li');
    skillItem.textContent = skill;
    skillList.appendChild(skillItem);
    document.getElementById('skill').value = '';
}