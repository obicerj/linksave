import { nanoid } from "nanoid";
import { publicRuntimeConfig } from "next.config";
import { toast } from "react-hot-toast";

export function isValidDomainName(string) {
  // regular expression that matches a string that represents a valid domain
  const regexp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;

  return regexp.test(string);
}

export function formatUrl(string) {
  let url;

  try {
    url = new URL(string);

    if (!url.hostname) {
      url = new URL("https://" + string);
    }
  } catch (error) {
    if (isValidDomainName(string)) {
      url = new URL("https://" + string);
    }
  }

  return url;
}

export function isValidHttpUrl(string) {
  // regular expression that matches a string that represents a valid URL
  const regexp =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return regexp.test(string);
}

export const fetchUrlMetadata = async (url) => {
  let response;

  try {
    response = await fetch(
      publicRuntimeConfig.jsonlink_api_url + `/extract?url=${url}`
    );

    if (!response.ok) {
      toast.error("You have entered an invalid URL");
      return false;
    }
  } catch (error) {
    console.log(error);
    return;
  }

  const data = await response.json();
  const linksArray = localStorage.getItem("links")
    ? JSON.parse(localStorage.getItem("links"))
    : [];

  const linkMetadata = {
    id: nanoid(),
    title: data.title,
    url: data.url,
    timestamp: Math.floor(Date.now() / 100),
  };

  linksArray.push(linkMetadata);

  localStorage.setItem("links", JSON.stringify(linksArray));

  const links = JSON.parse(localStorage.getItem("links"));

  return links;
};

export function extractDomainName(url = "") {
  if (!url) return;

  try {
    let domain = new URL(url);
    return domain.hostname;
  } catch (error) {
    console.log(error.message);
    return;
  }
}
