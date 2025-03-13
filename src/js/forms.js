function submitRecaptchaForm(e, keyId, action, formName, successRedirect, errorRedirect) {

  e.preventDefault();
  const form = document.getElementById(formName);

  for(let i=0; i < form.elements.length; i++){
    if(form.elements[i].value === '' && form.elements[i].hasAttribute('required')){
      alert('Please complete all required fields before submitting form.');
      return false;
    }
  }

  const submitButtons = form.querySelectorAll('input[type="submit"]');
  for (let button = 0; button<submitButtons.length;button++){
    submitButtons[button].disabled = true;
    submitButtons[button].classList.toggle("hidden") 
  }
  const loaders = form.getElementsByClassName("loader");
  for (let loader = 0; loader<loaders.length;loader++){
    loaders[loader].classList.toggle("hidden") 
  }

  try {
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(keyId, {action: action});
      const data = new FormData(form);
      data.append("token", token);
      data.append("action", action);
      const body = JSON.stringify(Object.fromEntries(data))
      const response = await fetch(form.action, {
        method: 'POST',
        mode: 'cors',
        body: body }
      )
      if (response["status"] === 200) {
        window.location.href = successRedirect;
      }
      else {
        window.location.href = errorRedirect;
      };
    })
  }
  catch {
    window.location.href = errorRedirect;
  }
}
