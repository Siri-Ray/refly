import { Button, Modal, Typography } from "@arco-design/web-react"
import { useCookie } from "react-use"
import Cookies from "js-cookie"

// styles
import "./index.scss"
import { useUserStore } from "@/stores/user"
import { useNavigate } from "react-router-dom"
import { getClientOrigin, getCookieOrigin, getExtensionId } from "@/utils/url"
// components
import { LanguageList } from "@/components/language-list"
import { IconDown } from "@arco-design/web-react/icon"
import { useTranslation } from "react-i18next"

export const Settings = () => {
  const [token, updateCookie, deleteCookie] = useCookie("_refly_ai_sid")
  const userStore = useUserStore()
  const navigate = useNavigate()
  const [modal, contextHolder] = Modal.useModal()

  const { t } = useTranslation()

  const handleLogout = () => {
    modal.confirm?.({
      title: t("settings.account.logoutConfirmation.title"),
      content: t("settings.account.logoutConfirmation.message"),
      onOk() {
        console.log("delete cookie")
        userStore.setUserProfile(null)
        userStore.setToken("")
        localStorage.removeItem("refly-user-profile")

        // 给插件发消息
        chrome.runtime?.sendMessage(getExtensionId(), {
          name: "logout-notification",
        })

        deleteCookie()
        getClientOrigin
        Cookies.remove("_refly_ai_sid", { domain: getCookieOrigin() })
        navigate("/")
      },
      onConfirm() {},
    })
  }

  return (
    <div className="settings-container">
      <div className="settings-inner-container">
        <div className="settings-title">{t("settings.title")}</div>
        <div>
          <Typography.Title heading={4}>
            {t("settings.language.title")}
          </Typography.Title>
          <LanguageList>
            <Button className="setting-page-language-btn">
              {t("language")} <IconDown />
            </Button>
          </LanguageList>
        </div>
        <div>
          <Typography.Title heading={4}>
            {t("settings.account.title")}
          </Typography.Title>
          <Button onClick={() => handleLogout()}>
            {t("settings.account.logout")}
          </Button>
        </div>
      </div>
      {contextHolder}
    </div>
  )
}
