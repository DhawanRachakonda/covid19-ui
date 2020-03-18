import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import { AppState } from '../../../store/rooReducerConfig';
import { useUserState } from '../providers/UserProvider';
import { getDocs } from '../../../store/docs';
import { ComponentLoader } from '../loaders/ComponentLoader';
import { FormattedHTMLMessage } from 'react-intl';

import './doc.css';

const ViewDoc = () => {
  const { userName } = useUserState();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDocs());
  }, [userName, dispatch]);
  const { isFetching, docs, isSuccess } = useSelector(
    (state: AppState) => state.docs
  );
  if (isFetching) {
    return <ComponentLoader />;
  }
  if (docs && isSuccess) {
    return (
      <ListGroup className="doc-view">
        {docs.map((doc) => (
          <ListGroupItem key={doc.id}>
            {doc.docName}
            <span className="pull-right">
              <DocBadges badges={doc.docBadges} docId={doc.id} />
            </span>
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
  return <FormattedHTMLMessage id="app.somethingWentWrong" />;
};

interface IDocBadgesProps {
  badges: string[];
  docId: string;
}

const DocBadges = ({ badges, docId }: IDocBadgesProps) => {
  return (
    <React.Fragment>
      {badges.map((badge) => (
        <span className="badge badge-info" key={docId + badge}>
          {badge}
        </span>
      ))}
    </React.Fragment>
  );
};

export default ViewDoc;
