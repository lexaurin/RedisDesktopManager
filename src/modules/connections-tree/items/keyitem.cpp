#include "keyitem.h"
#include <QMenu>
#include <qredisclient/utils/text.h>

#include "connections-tree/utils.h"

using namespace ConnectionsTree;

KeyItem::KeyItem(const QByteArray &fullPath, unsigned short dbIndex,
                 QSharedPointer<Operations> operations,
                 QWeakPointer<TreeItem> parent)
    : m_fullPath(fullPath),
      m_dbIndex(dbIndex),
      m_operations(operations),
      m_parent(parent),      
      m_removed(false)
{
    m_eventHandlers.insert("click", [this]() {
        if (isEnabled()) m_operations->openKeyTab(*this, false);
    });

    m_eventHandlers.insert("mid-click", [this]() {
        if (isEnabled()) m_operations->openKeyTab(*this, true);
    });
}

QString KeyItem::getDisplayName() const
{
    return printableString(m_fullPath);
}

QByteArray KeyItem::getName() const
{
    return m_fullPath;
}

QString KeyItem::getIconUrl() const
{
    return QString("qrc:/images/key.svg");
}

QList<QSharedPointer<TreeItem>> KeyItem::getAllChilds() const
{
    return QList<QSharedPointer<TreeItem>>();
}

bool KeyItem::supportChildItems() const
{
    return false;
}

uint KeyItem::childCount(bool) const
{
    return 0u;
}

QSharedPointer<TreeItem> KeyItem::child(uint) const
{
    return QSharedPointer<TreeItem>();
}

QWeakPointer<TreeItem> KeyItem::parent() const
{
    return m_parent;
}

bool KeyItem::isEnabled() const
{
    return isLocked() == false && m_removed == false;
}

QByteArray KeyItem::getFullPath() const
{
    return m_fullPath;
}

int KeyItem::getDbIndex() const
{
    return m_dbIndex;
}

void KeyItem::setRemoved()
{
    m_removed = true;
}
